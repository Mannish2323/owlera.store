import { createClient } from "@/lib/supabase-server";

export interface CouponValidationResult {
  valid: boolean;
  code: string;
  discount: number;
  message: string;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
}

/**
 * Validates a coupon code against Supabase database (with demo fallback).
 * Evaluates active status, expiry, minimum order value, usage limits, and calculates exact discount.
 */
export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<CouponValidationResult> {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, code: "", discount: 0, message: "Coupon code is required." };
  }

  // 1. Check Supabase database first
  const supabase = createClient();
  if (supabase) {
    try {
      const { data: coupon, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", cleanCode)
        .single();

      if (!error && coupon) {
        if (!coupon.is_active) {
          return { valid: false, code: cleanCode, discount: 0, message: "This coupon code is no longer active." };
        }

        if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
          return { valid: false, code: cleanCode, discount: 0, message: "This coupon code has expired." };
        }

        if (coupon.min_order_value && subtotal < coupon.min_order_value) {
          return {
            valid: false,
            code: cleanCode,
            discount: 0,
            message: `Minimum order value of ₹${coupon.min_order_value.toLocaleString("en-IN")} required.`
          };
        }

        if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
          return { valid: false, code: cleanCode, discount: 0, message: "This coupon has reached its maximum usage limit." };
        }

        let calculatedDiscount = 0;
        if (coupon.discount_type === "percentage") {
          calculatedDiscount = Math.round((subtotal * coupon.discount_value) / 100);
          if (coupon.max_discount && calculatedDiscount > coupon.max_discount) {
            calculatedDiscount = coupon.max_discount;
          }
        } else {
          // Fixed discount amount
          calculatedDiscount = Math.min(coupon.discount_value, subtotal);
        }

        return {
          valid: true,
          code: cleanCode,
          discount: calculatedDiscount,
          message: `Coupon ${cleanCode} applied!`,
          discountType: coupon.discount_type,
          discountValue: coupon.discount_value
        };
      }
    } catch (e) {
      console.error("Error querying database for coupon:", e);
    }
  }

  // 2. Demo fallback coupons (active when Supabase is not configured or coupon is demo)
  if (cleanCode === "OWLFIRST10") {
    const discount = Math.min(Math.round(subtotal * 0.1), 500);
    return {
      valid: true,
      code: "OWLFIRST10",
      discount,
      message: "10% off your order applied (up to ₹500)!",
      discountType: "percentage",
      discountValue: 10
    };
  }

  if (cleanCode === "SHINE200") {
    if (subtotal < 1999) {
      return {
        valid: false,
        code: "SHINE200",
        discount: 0,
        message: "Code SHINE200 requires a minimum order value of ₹1,999."
      };
    }
    return {
      valid: true,
      code: "SHINE200",
      discount: 200,
      message: "Flat ₹200 off your order applied!",
      discountType: "fixed",
      discountValue: 200
    };
  }

  return {
    valid: false,
    code: cleanCode,
    discount: 0,
    message: "Invalid or expired coupon code."
  };
}
