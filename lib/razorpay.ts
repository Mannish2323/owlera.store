import crypto from "crypto";

/**
 * Creates an order on Razorpay using server API credentials
 */
export async function createRazorpayOrder({
  amount,
  currency = "INR",
  receipt,
  notes = {}
}: {
  amount: number; // in paise (e.g. ₹1499 = 149900)
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured on the server.");
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`
    },
    body: JSON.stringify({
      amount,
      currency,
      receipt,
      notes
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.description || "Failed to create Razorpay order.");
  }

  return data;
}

/**
 * Verifies the Razorpay payment signature cryptographically on the server using HMAC-SHA256
 */
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
}

/**
 * Verifies Razorpay Webhook signature using HMAC-SHA256 and the configured RAZORPAY_WEBHOOK_SECRET
 */
export function verifyRazorpayWebhookSignature({
  rawBody,
  signature
}: {
  rawBody: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(signature, "utf-8")
    );
  } catch {
    return false;
  }
}
