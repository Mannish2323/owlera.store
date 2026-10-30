import assert from "node:assert";

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("====================================================================");
  console.log("OWLERA AUTH, PDP, CHECKOUT & CATEGORIES AUTOMATION VERIFICATION");
  console.log("====================================================================");

  let passed = 0;
  const testRoutes = [
    { url: "/auth/login", name: "Auth: Login Page" },
    { url: "/auth/register", name: "Auth: Register Page" },
    { url: "/auth/forgot-password", name: "Auth: Forgot Password Page" },
    { url: "/account", name: "Account: Customer Profile & Menu Page" },
    { url: "/cart", name: "Cart: Your Cart View" },
    { url: "/checkout", name: "Checkout: Address & Payment Page" },
    { url: "/orders", name: "Orders: Customer Order History & Tracking" },
    { url: "/categories", name: "Categories: All Categories 4-Col Grid" },
    { url: "/candles", name: "Category: Candles Collection" },
    { url: "/room-fresheners", name: "Category: Room Fresheners Collection" },
    { url: "/accessories", name: "Category: Accessories Collection" },
    { url: "/products/lavender-aromatherapy-candle", name: "PDP: Lavender Aromatherapy Candle" },
    { url: "/products/rudraksha-bracelet", name: "PDP: Rudraksha Bracelet" },
    { url: "/products/celeste-gold-hoops", name: "PDP: Celeste Gold Hoops" },
    { url: "/products/mata-ne-tee", name: "PDP: Mata Ne Tee" }
  ];

  for (const t of testRoutes) {
    try {
      const res = await fetch(`${BASE_URL}${t.url}`);
      assert.strictEqual(res.status, 200, `Expected 200 OK for ${t.url}, got ${res.status}`);
      const text = await res.text();
      assert.ok(text.length > 500, `Response body too short for ${t.url}`);
      passed++;
      console.log(`✓ [PASS ${passed}] ${t.name} (Status 200, Body length: ${text.length})`);
    } catch (e) {
      console.error(`✗ [FAIL] ${t.name}:`, e.message);
    }
  }

  console.log("====================================================================");
  console.log(`RESULT: ${passed}/${testRoutes.length} ROUTES VERIFIED AND ACTIVE`);
  console.log("====================================================================");

  if (passed !== testRoutes.length) {
    process.exit(1);
  }
}

runTests();

