import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";

const emailSchema = z.string().email("Please provide a valid email address.");

export async function POST(req: Request) {
  try {
    let email = "";
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      email = body.email;
    } else {
      const formData = await req.formData();
      email = formData.get("email") as string;
    }

    const parsed = emailSchema.safeParse(email?.trim());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const supabase = createClient();
    if (supabase) {
      await supabase
        .from("newsletter_subscribers")
        .insert({ email: parsed.data })
        .select()
        .single();
    }

    // If submitted via standard form action, redirect back with confirmation
    const referer = req.headers.get("referer") || "/";
    const redirectUrl = new URL(referer);
    redirectUrl.searchParams.set("subscribed", "1");

    return NextResponse.redirect(redirectUrl.toString(), { status: 303 });
  } catch (err: any) {
    return NextResponse.json({ error: "Subscription could not be processed." }, { status: 500 });
  }
}
