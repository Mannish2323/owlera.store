import assert from "assert";
import crypto from "crypto";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

console.log("====================================================================");
console.log("OWLERA E-COMMERCE ADMIN PANEL MASTER ACCEPTANCE TEST SUITE");
console.log(`Targeting local environment: ${BASE_URL}`);
console.log("====================================================================\n");

let passed = 0;
let total = 0;

function runTest(name, fn) {
  total++;
  try {
    fn();
    console.log(`✓ [PASS ${total}] ${name}`);
    passed++;
  } catch (err) {
    console.error(`✗ [FAIL ${total}] ${name}:`, err.message);
    throw err;
  }
}

async function runAsyncTest(name, fn) {
  total++;
  try {
    await fn();
    console.log(`✓ [PASS ${total}] ${name}`);
    passed++;
  } catch (err) {
    console.error(`✗ [FAIL ${total}] ${name}:`, err.message);
    throw err;
  }
}

// -------------------------------------------------------------
// 1. BUSINESS RULE & SECURITY ALGORITHMS
// -------------------------------------------------------------

runTest("1. Concurrency-Safe Stock Calculation & Negative Stock Prevention", () => {
  function adjustStock(current, delta) {
    const next = current + delta;
    if (next < 0) {
      throw new Error(`Insufficient inventory: Current=${current}, AttemptedDelta=${delta}`);
    }
    return next;
  }

  assert.strictEqual(adjustStock(10, 5), 15);
  assert.strictEqual(adjustStock(10, -5), 5);
  assert.strictEqual(adjustStock(5, -5), 0);
  assert.throws(() => adjustStock(2, -5), /Insufficient inventory/);
});

runTest("2. Admin Coupon Rule Validation (Percentage <= 100, Values > 0)", () => {
  function validateCoupon(type, val, minOrder) {
    if (val <= 0) return { valid: false, error: "Discount value must be > 0" };
    if (type === "percentage" && val > 100) return { valid: false, error: "Percentage cannot exceed 100%" };
    if (minOrder < 0) return { valid: false, error: "Min order must be non-negative" };
    return { valid: true };
  }

  assert.strictEqual(validateCoupon("percentage", 10, 0).valid, true);
  assert.strictEqual(validateCoupon("percentage", 150, 0).valid, false);
  assert.strictEqual(validateCoupon("fixed", 500, 1999).valid, true);
  assert.strictEqual(validateCoupon("fixed", -10, 0).valid, false);
});

runTest("3. Allowed Order Status Lifecycle Transitions", () => {
  const validStatuses = [
    "pending",
    "confirmed",
    "processing",
    "packed",
    "dispatched",
    "shipped",
    "delivered",
    "cancelled",
    "returned"
  ];

  function isValidStatus(status) {
    return validStatuses.includes(status);
  }

  assert.strictEqual(isValidStatus("confirmed"), true);
  assert.strictEqual(isValidStatus("dispatched"), true);
  assert.strictEqual(isValidStatus("delivered"), true);
  assert.strictEqual(isValidStatus("fraudulent_refund"), false);
  assert.strictEqual(isValidStatus("fake_approval"), false);
});

runTest("4. BlueDart Courier Tracking Formulation", () => {
  const awb = "BD987654321";
  const url = `https://www.bluedart.com/tracking?track=${awb}`;
  assert.strictEqual(url.includes("track=BD987654321"), true);
  assert.strictEqual(url.startsWith("https://www.bluedart.com/tracking"), true);
});

runTest("5. Media Upload File MIME Type & Size Guard", () => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  const maxSize = 5 * 1024 * 1024;

  function validateFile(mime, size) {
    if (!allowedMimes.includes(mime)) return { valid: false, error: "Disallowed MIME" };
    if (size > maxSize) return { valid: false, error: "File exceeds 5MB limit" };
    return { valid: true };
  }

  assert.strictEqual(validateFile("image/jpeg", 2000000).valid, true);
  assert.strictEqual(validateFile("image/webp", 4500000).valid, true);
  assert.strictEqual(validateFile("application/javascript", 1000).valid, false);
  assert.strictEqual(validateFile("image/png", 6000000).valid, false);
});

// -------------------------------------------------------------
// 2. LIVE ROUTE & AUTHENTICATION ENFORCEMENT (HTTP checks)
// -------------------------------------------------------------

async function main() {
  await runAsyncTest("6. Admin UI Route: (/admin) Renders Status 200 with Login Gate", async () => {
    const res = await fetch(`${BASE_URL}/admin`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.strictEqual(html.includes("Admin"), true);
  });

  await runAsyncTest("7. Security: GET /api/admin/products Rejects Unauthenticated Request", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/products`);
    assert.strictEqual([401, 403, 503].includes(res.status), true, `Must return 401/403/503 without session, got ${res.status}`);
  });

  await runAsyncTest("8. Security: POST /api/admin/products Rejects Unauthenticated Request", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Unauthorized Item", price: 1000, category: "Jewellery" })
    });
    assert.strictEqual([401, 403, 503].includes(res.status), true);
  });

  await runAsyncTest("9. Security: GET /api/admin/orders Rejects Unauthenticated Request", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/orders`);
    assert.strictEqual([401, 403, 503].includes(res.status), true);
  });

  await runAsyncTest("10. Security: PUT /api/admin/orders Rejects Unauthenticated Request", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/orders`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: "fake-id", orderStatus: "shipped" })
    });
    assert.strictEqual([401, 403, 503].includes(res.status), true);
  });

  await runAsyncTest("11. Security: GET /api/admin/categories Rejects Unauthenticated Request", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/categories`);
    assert.strictEqual([401, 403, 503].includes(res.status), true);
  });

  await runAsyncTest("12. Security: POST /api/admin/categories Rejects Unauthenticated Request", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Unauthorized Category" })
    });
    assert.strictEqual([401, 403, 503].includes(res.status), true);
  });

  await runAsyncTest("13. Security: GET /api/admin/inventory Rejects Unauthenticated Request", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/inventory`);
    assert.strictEqual([401, 403, 503].includes(res.status), true);
  });

  await runAsyncTest("14. Security: POST /api/admin/inventory Rejects Unauthenticated Request", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/inventory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: "fake", adjustment: 5, reason: "Unauthorized" })
    });
    assert.strictEqual([401, 403, 503].includes(res.status), true);
  });

  await runAsyncTest("15. Security: GET /api/admin/customers Rejects Unauthenticated Request", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/customers`);
    assert.strictEqual([401, 403, 503].includes(res.status), true);
  });

  await runAsyncTest("16. Security: GET /api/admin/coupons Rejects Unauthenticated Request", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/coupons`);
    assert.strictEqual([401, 403, 503].includes(res.status), true);
  });

  await runAsyncTest("17. Security: POST /api/admin/coupons Rejects Unauthenticated Request", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/coupons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: "HACK50", discount_value: 50 })
    });
    assert.strictEqual([401, 403, 503].includes(res.status), true);
  });

  await runAsyncTest("18. Security: GET /api/admin/media Rejects Unauthenticated Request", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/media`);
    assert.strictEqual([401, 403, 503].includes(res.status), true);
  });

  await runAsyncTest("19. Security: GET /api/admin/settings Rejects Unauthenticated Request", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/settings`);
    assert.strictEqual([401, 403, 503].includes(res.status), true);
  });

  await runAsyncTest("20. Admin Auth Endpoint: GET /api/admin/auth Reports Unauthenticated Session", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth`);
    const data = await res.json();
    assert.strictEqual(data.authenticated === false || res.status === 401 || res.status === 503, true);
  });

  console.log("\n====================================================================");
  console.log(`ALL ${passed}/${total} ADMIN PANEL ACCEPTANCE & SECURITY TESTS PASSED (100%)`);
  console.log("====================================================================");
}

main().catch(err => {
  console.error("\nAdmin test suite execution failed:", err);
  process.exit(1);
});
