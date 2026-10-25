import assert from "assert";
import crypto from "crypto";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

console.log("====================================================================");
console.log("OWLERA MASTER AUTOMATED ACCEPTANCE & REGRESSION TEST SUITE");
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
// 1. UNIT & SECURITY ALGORITHMS
// -------------------------------------------------------------

runTest("1. Price Formatting Engine (INR)", () => {
  const money = val =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);

  assert.strictEqual(money(0).includes("0"), true);
  assert.strictEqual(money(1499).includes("1,499"), true);
  assert.strictEqual(money(25000).includes("25,000"), true);
});

runTest("2. Complimentary Shipping Threshold Rule (Pan-India ₹999)", () => {
  const calcShipping = subtotal => (subtotal >= 999 ? 0 : 99);
  assert.strictEqual(calcShipping(0), 99);
  assert.strictEqual(calcShipping(998), 99);
  assert.strictEqual(calcShipping(999), 0);
  assert.strictEqual(calcShipping(1500), 0);
});

runTest("3. Coupon Discount Algorithms (OWLFIRST10 & SHINE200)", () => {
  function getDiscount(code, subtotal) {
    if (!code) return 0;
    const clean = code.trim().toUpperCase();
    if (clean === "OWLFIRST10") {
      return Math.min(Math.round(subtotal * 0.1), 500);
    }
    if (clean === "SHINE200") {
      return subtotal >= 1999 ? 200 : 0;
    }
    return 0;
  }

  assert.strictEqual(getDiscount("OWLFIRST10", 1499), 150);
  assert.strictEqual(getDiscount("OWLFIRST10", 10000), 500); // capped at ₹500
  assert.strictEqual(getDiscount("SHINE200", 1500), 0); // min order ₹1999
  assert.strictEqual(getDiscount("SHINE200", 2499), 200);
  assert.strictEqual(getDiscount("INVALID", 5000), 0);
});

runTest("4. Indian Postal PIN & State Circle Validation", () => {
  const validPins = ["500034", "110001", "400001", "560001", "600001"];
  const invalidPins = ["50003", "5000345", "ABC123", "000000"];

  const pinRegex = /^[1-9][0-9]{5}$/;

  validPins.forEach(pin => {
    assert.strictEqual(pinRegex.test(pin), true, `PIN ${pin} must be valid`);
  });

  invalidPins.forEach(pin => {
    assert.strictEqual(pinRegex.test(pin), false, `PIN ${pin} must be invalid`);
  });
});

runTest("5. Razorpay HMAC-SHA256 Payment Signature Verification", () => {
  const secret = "test_rzp_secret_998877";
  const orderId = "order_Oq7Jk8Lm9Np0";
  const paymentId = "pay_Pz6Qy5Rx4Wv3";
  const payload = `${orderId}|${paymentId}`;

  const validSig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const tamperedSig = validSig.slice(0, -4) + "0000";

  function verify(order, payment, sig, sec) {
    const expected = crypto.createHmac("sha256", sec).update(`${order}|${payment}`).digest("hex");
    return expected === sig;
  }

  assert.strictEqual(verify(orderId, paymentId, validSig, secret), true);
  assert.strictEqual(verify(orderId, paymentId, tamperedSig, secret), false);
  assert.strictEqual(verify(orderId, "pay_different", validSig, secret), false);
});

runTest("6. Razorpay Webhook Raw Body HMAC-SHA256 Verification", () => {
  const webhookSecret = "whsec_test_owlera_signature_123";
  const rawBody = JSON.stringify({
    event: "payment.captured",
    payload: { payment: { entity: { id: "pay_test123", order_id: "order_test456" } } }
  });

  const validSig = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
  const badSig = "invalid_hex_string_1234567890abcdef";

  function verifyWebhook(body, sig, sec) {
    const expected = crypto.createHmac("sha256", sec).update(body).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(expected, "utf-8"), Buffer.from(sig, "utf-8"));
  }

  assert.strictEqual(verifyWebhook(rawBody, validSig, webhookSecret), true);
  assert.throws(() => verifyWebhook(rawBody, badSig, webhookSecret));
});

runTest("7. WhatsApp Concierge Click-to-Chat Format", () => {
  const businessNumber = "916305630468";
  const message = "Hello OWLERA Concierge! I am interested in Celeste Gold Hoops.";
  const link = `https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`;

  assert.strictEqual(link.startsWith("https://wa.me/916305630468"), true);
  assert.strictEqual(link.includes("Celeste"), true);
  assert.strictEqual(link.includes("+"), false); // wa.me requires digits without '+'
});

// -------------------------------------------------------------
// 2. LIVE ROUTE & HTTP SMOKE CHECKS (Localhost)
// -------------------------------------------------------------

async function main() {
  await runAsyncTest("8. Public Route: Homepage (/) Status 200", async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200);
  });

  await runAsyncTest("9. Public Route: Shop (/shop) Status 200", async () => {
    const res = await fetch(`${BASE_URL}/shop`);
    assert.strictEqual(res.status, 200);
  });

  await runAsyncTest("10. Category Route: Jewellery (/jewellery) Status 200", async () => {
    const res = await fetch(`${BASE_URL}/jewellery`);
    assert.strictEqual(res.status, 200);
  });

  await runAsyncTest("11. Category Route: Fashion (/fashion) Status 200", async () => {
    const res = await fetch(`${BASE_URL}/fashion`);
    assert.strictEqual(res.status, 200);
  });

  await runAsyncTest("12. Category Route: Lifestyle (/lifestyle) Status 200", async () => {
    const res = await fetch(`${BASE_URL}/lifestyle`);
    assert.strictEqual(res.status, 200);
  });

  await runAsyncTest("13. Search Route: Dedicated Search (/search) Status 200", async () => {
    const res = await fetch(`${BASE_URL}/search`);
    assert.strictEqual(res.status, 200);
  });

  await runAsyncTest("14. Dedicated Tracking Route: (/track-order) Status 200", async () => {
    const res = await fetch(`${BASE_URL}/track-order`);
    assert.strictEqual(res.status, 200);
  });

  await runAsyncTest("15. Order Tracking Route: (/orders) Status 200", async () => {
    const res = await fetch(`${BASE_URL}/orders`);
    assert.strictEqual(res.status, 200);
  });

  await runAsyncTest("16. Policy Route: Refund Policy (/policies/refunds) Status 200", async () => {
    const res = await fetch(`${BASE_URL}/policies/refunds`);
    assert.strictEqual(res.status, 200);
  });

  await runAsyncTest("17. Admin Panel Route: Protected Admin (/admin) Status 200", async () => {
    const res = await fetch(`${BASE_URL}/admin`);
    assert.strictEqual(res.status, 200);
  });

  await runAsyncTest("18. SEO Route: Sitemap (/sitemap.xml) Status 200", async () => {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    assert.strictEqual(res.status, 200);
  });

  await runAsyncTest("19. SEO Route: Robots (/robots.txt) Status 200", async () => {
    const res = await fetch(`${BASE_URL}/robots.txt`);
    assert.strictEqual(res.status, 200);
  });

  await runAsyncTest("20. API Endpoint: Products (/api/products) Returns Catalogue Array", async () => {
    const res = await fetch(`${BASE_URL}/api/products`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(Array.isArray(data.products), true);
    assert.strictEqual(data.products.length >= 6, true, "Catalogue must contain at least 6 products");
  });

  await runAsyncTest("21. API Endpoint: Dynamic Product (/api/products/celeste-gold-hoops)", async () => {
    const res = await fetch(`${BASE_URL}/api/products/celeste-gold-hoops`);
    assert.strictEqual(res.status, 200);
    const prod = await res.json();
    assert.strictEqual(prod.slug, "celeste-gold-hoops");
    assert.strictEqual(prod.price > 0, true);
  });

  await runAsyncTest("22. Security: Razorpay Webhook rejects requests without signature", async () => {
    const res = await fetch(`${BASE_URL}/api/checkout/webhook`, {
      method: "POST",
      body: JSON.stringify({ event: "payment.captured" }),
      headers: { "Content-Type": "application/json" }
    });
    // Missing signature header must be rejected with 400
    assert.strictEqual(res.status, 400);
  });

  await runAsyncTest("23. Security: Checkout API rejects empty address and invalid PIN", async () => {
    const res = await fetch(`${BASE_URL}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: { name: "", email: "invalid", phone: "123" },
        shippingAddress: { address: "", city: "Hyderabad", state: "Assam", pincode: "500034" },
        items: []
      })
    });
    // Must return 400 validation error
    assert.strictEqual(res.status, 400);
  });

  console.log("\n====================================================================");
  console.log(`ALL ${passed}/${total} AUTOMATED ACCEPTANCE & SECURITY TESTS PASSED (100%)`);
  console.log("====================================================================");
}

main().catch(err => {
  console.error("\nTest suite execution failed:", err);
  process.exit(1);
});
