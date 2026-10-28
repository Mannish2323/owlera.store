import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { verifyAdmin } from "@/lib/admin-auth";

export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return NextResponse.json(
      { authenticated: false, error: auth.error },
      { status: auth.status }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: auth.userId,
      email: auth.email
    }
  });
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const supabase = createClient();
    if (!supabase) {
      // In local development without Supabase configured
      return NextResponse.json(
        { error: "Supabase database credentials are not configured in environment." },
        { status: 503 }
      );
    }

    // 1. Sign in with Supabase Auth
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authErr || !authData.user) {
      return NextResponse.json(
        { error: authErr?.message || "Invalid administrative credentials." },
        { status: 401 }
      );
    }

    // 2. Verify admin role or presence in admin_users
    const userId = authData.user.id;
    const { data: adminRecord } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userId)
      .single();

    if (!adminRecord) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (!profile || profile.role !== "admin") {
        await supabase.auth.signOut();
        return NextResponse.json(
          { error: "Access denied. Your account is not authorized as an OWLERA administrator." },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Login failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const supabase = createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  return NextResponse.json({ success: true, message: "Signed out successfully." });
}
