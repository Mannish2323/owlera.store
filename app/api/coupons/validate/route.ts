import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/coupons";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json(
        { valid: false, message: "Please enter a coupon code." },
        { status: 400 }
      );
    }

    const subtotalNumber = Number(subtotal) || 0;
    const result = await validateCoupon(code, subtotalNumber);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { valid: false, message: error.message || "Failed to validate coupon." },
      { status: 500 }
    );
  }
}
