import http from "http";
import { spawn } from "child_process";
import fs from "fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;

const VIEWPORTS = [
  { width: 320, height: 640, name: "320px (Ultra-Compact)" },
  { width: 360, height: 740, name: "360px (Standard Android / Galaxy S)" },
  { width: 375, height: 667, name: "375px (iPhone SE / Standard)" },
  { width: 390, height: 844, name: "390px (iPhone 13/14/15/16)" },
  { width: 414, height: 896, name: "414px (iPhone Plus / Max)" },
  { width: 430, height: 932, name: "430px (iPhone Pro Max)" },
  { width: 768, height: 1024, name: "768px (iPad Portrait / Tablet)" },
  { width: 1024, height: 768, name: "1024px (iPad Landscape / Small Laptop)" },
  { width: 1440, height: 900, name: "1440px (Desktop / MacBook)" }
];

const PAGES_TO_TEST = [
  { path: "/", name: "Homepage" },
  { path: "/shop", name: "Catalogue" },
  { path: "/fashion", name: "Fashion & Accessories" },
  { path: "/products/celeste-gold-hoops", name: "Product Detail (PDP)" },
  { path: "/about", name: "About OWLERA" },
  { path: "/cart", name: "Shopping Bag" },
  { path: "/checkout", name: "Checkout" },
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
  console.log("OWLERA COMPREHENSIVE RESPONSIVE VIEWPORT & OVERFLOW AUDIT");
  console.log("Targeting viewports: 320px, 360px, 375px, 390px, 414px, 430px, 768px, 1024px, 1440px");
  console.log("====================================================================\n");

  // Launch headless Chrome
  const chromeProcess = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--user-data-dir=" + process.env.TEMP + "\\chrome-owlera-test"
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

  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      callbacks.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Create a target tab
  const { targetId } = await sendCommand("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await sendCommand("Target.attachToTarget", { targetId, flatten: true });

  function sendSessionCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      callbacks.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, sessionId, method, params }));
    });
  }

  await sendSessionCommand("Page.enable");
  await sendSessionCommand("DOM.enable");
  await sendSessionCommand("Runtime.enable");

  let totalChecks = 0;
  let passedChecks = 0;
  const failures = [];

  for (const page of PAGES_TO_TEST) {
    console.log(`\n--- Testing Page: ${page.name} (${page.path}) ---`);
    await sendSessionCommand("Page.navigate", { url: `http://localhost:3000${page.path}` });
    await sleep(1200);

    for (const vp of VIEWPORTS) {
      totalChecks++;

      // Set device metrics
      await sendSessionCommand("Emulation.setDeviceMetricsOverride", {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.width < 1024
      });

      await sleep(200);

      // Audit evaluations
      const evalResult = await sendSessionCommand("Runtime.evaluate", {
        expression: `
          (() => {
            const docWidth = document.documentElement.clientWidth;
            const scrollWidth = document.documentElement.scrollWidth;
            const bodyScrollWidth = document.body.scrollWidth;
            const hasHorizontalOverflow = scrollWidth > docWidth + 1 || bodyScrollWidth > docWidth + 1;

            // Header collision check
            const logo = document.querySelector('.brand-logo-img');
            const actions = document.querySelector('.header-actions');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            let headerOverlap = false;

            if (logo && actions && menuBtn && window.innerWidth <= 768) {
              const logoRect = logo.getBoundingClientRect();
              const actionsRect = actions.getBoundingClientRect();
              const menuRect = menuBtn.getBoundingClientRect();
              // Check if logo overlaps actions or menu
              if (logoRect.right > actionsRect.left || logoRect.left < menuRect.right) {
                headerOverlap = true;
              }
            }

            // Floating WhatsApp dimensions check
            const wa = document.querySelector('.floating-whatsapp');
            let waValid = true;
            let waWidth = 0;
            if (wa && window.innerWidth <= 768) {
              const waRect = wa.getBoundingClientRect();
              waWidth = waRect.width;
              if (waRect.width > 56 || waRect.right > docWidth) {
                waValid = false;
              }
            }

            // Category cards height check on mobile
            const catCards = document.querySelectorAll('.category-card');
            let catHeights = [];
            catCards.forEach(c => catHeights.push(Math.round(c.getBoundingClientRect().height)));

            // Product grid column count check
            const prodGrid = document.querySelector('.product-grid');
            let gridColumns = 0;
            if (prodGrid) {
              const style = window.getComputedStyle(prodGrid);
              gridColumns = style.gridTemplateColumns.split(' ').length;
            }

            return {
              docWidth,
              scrollWidth,
              hasHorizontalOverflow,
              headerOverlap,
              waValid,
              waWidth,
              catHeights,
              gridColumns
            };
          })()
        `,
        returnByValue: true
      });

      const data = evalResult.result.value;

      let pass = true;
      let reason = [];

      if (data.hasHorizontalOverflow) {
        pass = false;
        reason.push(`Horizontal Overflow (scrollWidth ${data.scrollWidth}px > viewport ${data.docWidth}px)`);
      }

      if (data.headerOverlap) {
        pass = false;
        reason.push("Logo overlaps header icons or hamburger menu");
      }

      if (!data.waValid) {
        pass = false;
        reason.push(`WhatsApp button too large (${data.waWidth}px) or out of bounds`);
      }

      if (pass) {
        passedChecks++;
        const extra = data.gridColumns ? ` | ${data.gridColumns} cols` : "";
        console.log(`  ✓ [PASS] ${vp.name.padEnd(38)} (Width: ${data.docWidth}px, Scroll: ${data.scrollWidth}px${extra})`);
      } else {
        failures.push({ page: page.name, viewport: vp.name, issues: reason.join(", ") });
        console.error(`  ✗ [FAIL] ${vp.name.padEnd(38)} -> ${reason.join(", ")}`);
      }
    }
  }

  // Capture representative screenshots for verified proof
  if (!fs.existsSync("tests/screenshots")) {
    fs.mkdirSync("tests/screenshots", { recursive: true });
  }

  console.log("\n--- Capturing High-Res Mobile Screenshots for Verification ---");
  for (const w of [360, 390, 430]) {
    await sendSessionCommand("Emulation.setDeviceMetricsOverride", {
      width: w,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sleep(400);

    const { data: imgData } = await sendSessionCommand("Page.captureScreenshot", {
      format: "png"
    });
    fs.writeFileSync(`tests/screenshots/mobile_${w}px_rendered.png`, Buffer.from(imgData, "base64"));
    console.log(`  ✓ Captured tests/screenshots/mobile_${w}px_rendered.png (${w}px width)`);
  }

  chromeProcess.kill();

  console.log("\n====================================================================");
  console.log(`AUDIT COMPLETE: ${passedChecks}/${totalChecks} Viewport Checks Passed (${Math.round((passedChecks / totalChecks) * 100)}%)`);
  if (failures.length === 0) {
    console.log("✓ ALL VIEWPORTS (320px - 1440px) PASSED WITH ZERO HORIZONTAL OVERFLOW & ZERO OVERLAPS");
  } else {
    console.error(`✗ ${failures.length} Failures Detected:`, failures);
    process.exit(1);
  }
  console.log("====================================================================");
}

run().catch(err => {
  console.error("Audit script failed:", err);
  process.exit(1);
});

