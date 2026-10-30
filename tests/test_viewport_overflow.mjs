import http from "http";
import { spawn } from "child_process";
import fs from "fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;

const VIEWPORTS = [
  { width: 320, height: 640, name: "320px (Ultra-Compact Android)" },
  { width: 360, height: 740, name: "360px (Standard Android Galaxy S / A-series)" },
  { width: 375, height: 667, name: "375px (Compact Mobile / iPhone SE)" },
  { width: 390, height: 844, name: "390px (Standard Modern Phone)" },
  { width: 412, height: 915, name: "412px (Android Flagship - Pixel 7/8/9, Galaxy S23/S24)" },
  { width: 430, height: 932, name: "430px (Large Android / Pro Max)" },
  { width: 768, height: 1024, name: "768px (Tablet Portrait)" },
  { width: 1024, height: 768, name: "1024px (Tablet Landscape / Laptop)" },
  { width: 1440, height: 900, name: "1440px (Desktop Workstation)" }
];

const PAGES_TO_TEST = [
  { path: "/", name: "Screen 1: Android Home" },
  { path: "/categories", name: "Screen 2: All Categories" },
  { path: "/fashion", name: "Screen 3: Clothing & Apparel" },
  { path: "/products/lavender-aromatherapy-candle", name: "Screen 4: Product Detail (PDP)" },
  { path: "/cart", name: "Screen 5: Cart & Selection" },
  { path: "/account", name: "Screen 6: Customer Account" },
  { path: "/shop", name: "Catalogue & Search" },
  { path: "/checkout", name: "Checkout & Payments" },
  { path: "/wishlist", name: "Wishlist" }
];

async function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = "";
      res.on("data", chunk => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

async function run() {
  console.log("====================================================================");
  console.log("OWLERA MASTER ANDROID MOBILE & RESPONSIVE AUDIT");
  console.log("Testing Viewports: 320px, 360px, 375px, 390px, 412px, 430px, 768px, 1024px, 1440px");
  console.log("Targeting screens: Home, Categories, Clothing, PDP, Cart, Account, Shop, Checkout, Wishlist");
  console.log("====================================================================\n");

  const chromeProcess = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--user-data-dir=" + process.env.TEMP + "\\chrome-owlera-android-test"
  ]);

  await sleep(1500);

  let versionInfo;
  for (let i = 0; i < 10; i++) {
    try {
      versionInfo = await getJson(`http://127.0.0.1:${PORT}/json/version`);
      break;
    } catch {
      await sleep(500);
    }
  }

  if (!versionInfo) {
    console.error("Failed to connect to headless Chrome debugging port.");
    chromeProcess.kill();
    process.exit(1);
  }

  const wsUrl = versionInfo.webSocketDebuggerUrl;
  const ws = new WebSocket(wsUrl);

  let idCounter = 1;
  const callbacks = new Map();

  ws.onmessage = event => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const cb = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) cb.reject(msg.error);
      else cb.resolve(msg.result);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      callbacks.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  await new Promise(res => {
    if (ws.readyState === WebSocket.OPEN) res();
    else ws.onopen = res;
  });

  // Create target page
  const target = await send("Target.createTarget", { url: "about:blank" });
  const targetId = target.targetId;

  // Attach to target
  const session = await send("Target.attachToTarget", { targetId, flatten: true });
  const sessionId = session.sessionId;

  const sendSession = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      callbacks.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, sessionId, method, params }));
    });
  };

  await sendSession("Page.enable");
  await sendSession("DOM.enable");
  await sendSession("CSS.enable");

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  for (const page of PAGES_TO_TEST) {
    console.log(`\n--- Testing Screen: ${page.name} (${page.path}) ---`);

    for (const vp of VIEWPORTS) {
      totalTests++;

      // Set viewport
      await sendSession("Emulation.setDeviceMetricsOverride", {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.width <= 768
      });

      // Navigate
      await sendSession("Page.navigate", { url: `http://localhost:3000${page.path}` });
      await sleep(800);

      // Check overflow & scrollWidth vs clientWidth
      const evalRes = await sendSession("Runtime.evaluate", {
        expression: `
          (() => {
            const docWidth = document.documentElement.clientWidth;
            const scrollWidth = document.documentElement.scrollWidth;
            const bodyScrollWidth = document.body.scrollWidth;
            const maxScroll = Math.max(scrollWidth, bodyScrollWidth);
            const overflow = maxScroll > docWidth + 1; // 1px rounding tolerance
            
            // Check bottom navigation visibility on mobile
            const bottomNav = document.querySelector('.android-bottom-nav');
            const bottomNavVisible = bottomNav ? window.getComputedStyle(bottomNav).display !== 'none' : false;

            return {
              docWidth,
              maxScroll,
              overflow,
              bottomNavVisible
            };
          })()
        `,
        returnByValue: true
      });

      const res = evalRes.result.value;

      if (!res.overflow) {
        passedTests++;
        console.log(`  ✓ [PASS] ${vp.name.padEnd(46)} (DocWidth: ${res.docWidth}px, Scroll: ${res.maxScroll}px${vp.width <= 768 ? `, BottomNav: ${res.bottomNavVisible ? 'ON' : 'OFF'}` : ''})`);
      } else {
        failedTests++;
        console.error(`  ✗ [FAIL] ${vp.name.padEnd(46)} (DocWidth: ${res.docWidth}px, Overflow Scroll: ${res.maxScroll}px - Excess: +${res.maxScroll - res.docWidth}px)`);
      }
    }
  }

  // Capture high-res screenshots of Android 412px for visual verification
  if (!fs.existsSync("tests/screenshots")) {
    fs.mkdirSync("tests/screenshots", { recursive: true });
  }

  console.log("\n--- Capturing Verified Android 412px Screenshots ---");
  for (const p of PAGES_TO_TEST.slice(0, 6)) {
    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: 412,
      height: 860,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sendSession("Page.navigate", { url: `http://localhost:3000${p.path}` });
    await sleep(900);

    const shot = await sendSession("Page.captureScreenshot", { format: "png" });
    const filename = `tests/screenshots/android_${p.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}.png`;
    fs.writeFileSync(filename, Buffer.from(shot.data, "base64"));
    console.log(`  ✓ Saved ${filename}`);
  }

  console.log("\n====================================================================");
  console.log(`AUDIT COMPLETE: ${passedTests}/${totalTests} Checks Passed (${Math.round((passedTests/totalTests)*100)}%)`);
  if (failedTests === 0) {
    console.log("✓ ALL ANDROID VIEWPORTS & SCREEN LAYOUTS PASSED WITH 0 HORIZONTAL OVERFLOW!");
  } else {
    console.error(`✗ ${failedTests} checks failed overflow tolerance.`);
  }
  console.log("====================================================================\n");

  ws.close();
  chromeProcess.kill();
  process.exit(failedTests > 0 ? 1 : 0);
}

run().catch(err => {
  console.error("Audit error:", err);
  process.exit(1);
});
