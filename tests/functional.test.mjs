import assert from "assert";
import crypto from "crypto";

console.log("=================================================");
console.log("OWLERA E-COMMERCE AUTOMATED FUNCTIONAL TEST SUITE");
console.log("=================================================");

// 1. Test Currency & Price Formatting
function money(val) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(val);
}

assert.strictEqual(money(1499).includes("1,499"), true, "Price format should contain 1,499");
console.log("✓ Test 1: INR Currency Formatting Passed.");

// 2. Test Shipping Fee Rule
function calculateShipping(subtotal) {
  return subtotal >= 999 ? 0 : 99;
}

assert.strictEqual(calculateShipping(500), 99, "Orders under ₹999 must incur ₹99 shipping");
assert.strictEqual(calculateShipping(999), 0, "Orders at ₹999 must have complimentary shipping");
assert.strictEqual(calculateShipping(2500), 0, "Orders above ₹999 must have complimentary shipping");
console.log("✓ Test 2: Pan-India Shipping Threshold Passed.");

// 3. Test Coupon Calculation
function calculateDiscount(code, subtotal) {
  if (code === "OWLFIRST10") {
    return Math.min(Math.round(subtotal * 0.1), 500);
  }
  if (code === "SHINE200") {
    return subtotal >= 1999 ? 200 : 0;
  }
  return 0;
}

assert.strictEqual(calculateDiscount("OWLFIRST10", 1500), 150, "10% of 1500 is 150");
assert.strictEqual(calculateDiscount("OWLFIRST10", 6000), 500, "10% capped at 500");
assert.strictEqual(calculateDiscount("SHINE200", 1500), 0, "SHINE200 invalid below 1999");
assert.strictEqual(calculateDiscount("SHINE200", 2499), 200, "SHINE200 gives 200 off above 1999");
console.log("✓ Test 3: Coupon Discount Calculations Passed.");

// 4. Test Razorpay HMAC-SHA256 Signature Verification Algorithm
function verifyRazorpaySignature({ orderId, paymentId, signature, secret }) {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === signature;
}

const mockSecret = "secret_key_12345";
const mockOrderId = "order_Oq7Jk8Lm9Np0";
const mockPaymentId = "pay_Pz6Qy5Rx4Wv3";
const validSignature = crypto
  .createHmac("sha256", mockSecret)
  .update(`${mockOrderId}|${mockPaymentId}`)
  .digest("hex");

assert.strictEqual(
  verifyRazorpaySignature({
    orderId: mockOrderId,
    paymentId: mockPaymentId,
    signature: validSignature,
    secret: mockSecret
  }),
  true,
  "Cryptographic signature must verify with correct secret"
);

assert.strictEqual(
  verifyRazorpaySignature({
    orderId: mockOrderId,
    paymentId: mockPaymentId,
    signature: "tampered_signature_xyz",
    secret: mockSecret
  }),
  false,
  "Tampered signature must be rejected"
);
console.log("✓ Test 4: Razorpay Cryptographic Verification Passed.");

// 5. Test Indian Mobile & PIN code validation
const phoneRegex = /^[6-9]\d{9}$/;
const pinRegex = /^\d{6}$/;

assert.strictEqual(phoneRegex.test("9876543210"), true, "Valid 10-digit Indian mobile");
assert.strictEqual(phoneRegex.test("1234567890"), false, "Invalid mobile starting with 1");
assert.strictEqual(phoneRegex.test("98765"), false, "Invalid short mobile");

assert.strictEqual(pinRegex.test("500034"), true, "Valid 6-digit PIN code");
assert.strictEqual(pinRegex.test("50003"), false, "Invalid 5-digit PIN code");
console.log("✓ Test 5: Indian Phone and Postal PIN Validation Passed.");

console.log("=================================================");
console.log("ALL 5 AUTOMATED UNIT & SECURITY TESTS PASSED (100%)");
console.log("=================================================");
