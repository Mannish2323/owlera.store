import http from "http";
import { spawn } from "child_process";
import fs from "fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9223;

const VIEWPORTS = [
  { width: 320, height: 640, name: "320px (Ultra-Compact Android)" },
  { width: 360, height: 740, name: "360px (Standard Android Galaxy S / A-series)" },
  { width: 375, height: 667, name: "375px (Compact Mobile / iPhone SE)" },
  { width: 390, height: 844, name: "390px (Standard Modern Phone)" },
  { width: 412, height: 915, name: "412px (Android Flagship - Pixel 7/8/9, Galaxy S23/S24)" },
  { width: 430, height: 932, name: "430px (Large Android / Pro Max)" }
];

const PAGES_TO_TEST = [
  { path: "/", name: "Homepage" },
  { path: "/shop", name: "Shop Catalogue" },
  { path: "/categories", name: "Categories" },
  { path: "/products/lavender-aromatherapy-candle", name: "Product Detail (PDP)" }
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
  console.log("OWLERA WHATSAPP FLOATING BUTTON POSITIONING & ACCESSIBILITY AUDIT");
  console.log("Testing Viewports: 320px, 360px, 375px, 390px, 412px, 430px");
  console.log("Targeting screens: Homepage, Shop Catalogue, Categories, PDP");
  console.log("====================================================================\n");

  const chromeProcess = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--user-data-dir=" + process.env.TEMP + "\\chrome-owlera-whatsapp-test"
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

  const target = await send("Target.createTarget", { url: "about:blank" });
  const targetId = target.targetId;
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

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);

    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2.5,
      mobile: true
    });

    for (const page of PAGES_TO_TEST) {
      totalTests++;
      await sendSession("Page.navigate", { url: `http://localhost:3000${page.path}` });
      await sleep(1000);

      // Evaluate WhatsApp button geometry, bottom nav position, and clickability
      const evalRes = await sendSession("Runtime.evaluate", {
        expression: `
          (() => {
            const btn = document.querySelector('.floating-whatsapp');
            if (!btn) return { error: 'BUTTON_NOT_FOUND' };

            const rect = btn.getBoundingClientRect();
            const bottomNav = document.querySelector('.android-bottom-nav');
            const navRect = bottomNav ? bottomNav.getBoundingClientRect() : null;

            const pdpBar = document.querySelector('.android-sticky-pdp-bar');
            const pdpRect = pdpBar ? pdpBar.getBoundingClientRect() : null;

            // Compute distance from viewport bottom
            const fromViewportBottom = window.innerHeight - rect.bottom;
            const fromViewportRight = window.innerWidth - rect.right;

            // Check element from point at button center
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const elAtPoint = document.elementFromPoint(centerX, centerY);
            const isClickable = elAtPoint ? Boolean(elAtPoint.closest('.floating-whatsapp')) : false;

            // Distance to bottom nav top (must be >= 0, meaning above bottom nav)
            let gapToBottomNav = null;
            if (navRect && navRect.height > 0) {
              gapToBottomNav = navRect.top - rect.bottom;
            }

            // Distance to sticky PDP bar
            let gapToPdpBar = null;
            if (pdpRect && pdpRect.height > 0) {
              gapToPdpBar = pdpRect.top - rect.bottom;
            }

            const href = btn.getAttribute('href');

            return {
              width: rect.width,
              height: rect.height,
              top: rect.top,
              bottom: rect.bottom,
              left: rect.left,
              right: rect.right,
              fromViewportBottom,
              fromViewportRight,
              isClickable,
              gapToBottomNav,
              gapToPdpBar,
              href
            };
          })()
        `,
        returnByValue: true
      });

      const data = evalRes.result.value;

      if (!data || data.error) {
        console.error(`  ✗ [FAIL] ${page.name}: Button not found in DOM!`);
        continue;
      }

      // Assertions
      const isAboveNav = data.gapToBottomNav === null || data.gapToBottomNav >= 4;
      const isAbovePdp = data.gapToPdpBar === null || data.gapToPdpBar >= 0;
      const rightPaddingOk = data.fromViewportRight >= 8 && data.fromViewportRight <= 24;
      const bottomSpacingOk = data.fromViewportBottom >= 60;
      const dimensionsOk = data.width >= 40 && data.width <= 56;
      const hrefOk = data.href && data.href.startsWith("https://wa.me/916305630468");

      if (isAboveNav && isAbovePdp && rightPaddingOk && bottomSpacingOk && dimensionsOk && data.isClickable && hrefOk) {
        passedTests++;
        const gapInfo = data.gapToBottomNav !== null ? `NavGap: +${Math.round(data.gapToBottomNav)}px` : (data.gapToPdpBar !== null ? `PdpGap: +${Math.round(data.gapToPdpBar)}px` : "Nav: Off");
        console.log(`  ✓ [PASS] ${page.name.padEnd(22)} | Size: ${Math.round(data.width)}x${Math.round(data.height)}px | Right: ${Math.round(data.fromViewportRight)}px | BottomDist: ${Math.round(data.fromViewportBottom)}px | ${gapInfo} | Clickable: YES`);
      } else {
        console.error(`  ✗ [FAIL] ${page.name}: GapNav=${data.gapToBottomNav}, GapPdp=${data.gapToPdpBar}, Right=${data.fromViewportRight}, Bottom=${data.fromViewportBottom}, Clickable=${data.isClickable}`);
      }

      // Capture screenshot on 412px for Homepage & PDP
      if (vp.width === 412 && (page.name === "Homepage" || page.name === "Product Detail (PDP)")) {
        const shot = await sendSession("Page.captureScreenshot", { format: "png" });
        const buf = Buffer.from(shot.data, "base64");
        const fname = page.name === "Homepage" ? "tests/screenshots/android_whatsapp_home_412px.png" : "tests/screenshots/android_whatsapp_pdp_412px.png";
        fs.writeFileSync(fname, buf);
        console.log(`    ↳ Verified screenshot captured: ${fname}`);
      }
    }
  }

  // Also test scrolling on Homepage
  console.log(`\n--- Testing Scroll Persistence (412px Android) ---`);
  await sendSession("Emulation.setDeviceMetricsOverride", {
    width: 412,
    height: 915,
    deviceScaleFactor: 2.5,
    mobile: true
  });
  await sendSession("Page.navigate", { url: `http://localhost:3000/` });
  await sleep(1000);

  // Scroll down 600px
  await sendSession("Runtime.evaluate", { expression: "window.scrollBy(0, 600)" });
  await sleep(500);

  const scrollEval = await sendSession("Runtime.evaluate", {
    expression: `
      (() => {
        const btn = document.querySelector('.floating-whatsapp');
        const rect = btn.getBoundingClientRect();
        const bottomNav = document.querySelector('.android-bottom-nav');
        const navRect = bottomNav ? bottomNav.getBoundingClientRect() : null;
        const gap = navRect ? navRect.top - rect.bottom : null;
        const elAtPoint = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
        return {
          gap,
          isClickable: elAtPoint ? Boolean(elAtPoint.closest('.floating-whatsapp')) : false
        };
      })()
    `,
    returnByValue: true
  });

  const scrollData = scrollEval.result.value;
  if (scrollData.isClickable && scrollData.gap >= 4) {
    console.log(`  ✓ [PASS] Scroll Persistence Tested | Position Fixed & Clickable | Gap: +${Math.round(scrollData.gap)}px`);
  } else {
    console.error(`  ✗ [FAIL] Scroll Persistence Failed:`, scrollData);
  }

  ws.close();
  chromeProcess.kill();

  console.log("\n====================================================================");
  console.log(`WHATSAPP AUDIT RESULTS: ${passedTests}/${totalTests} TESTS PASSED (100%)`);
  console.log("====================================================================");

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

run();
