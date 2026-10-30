"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase-browser";

export interface CustomerProfile {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface AuthContextType {
  user: any | null;
  profile: CustomerProfile | null;
  session: any | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, pass: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  updateProfile: (updates: Partial<CustomerProfile>) => Promise<{ success: boolean; error?: string }>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync profile from Supabase user and localStorage cache
  const syncProfile = useCallback(async (authUser: any) => {
    if (!authUser) {
      setProfile(null);
      return;
    }

    const cachedKey = `owlera-profile-${authUser.id}`;
    let baseProfile: CustomerProfile = {
      id: authUser.id,
      name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split("@")[0] || "Valued Client",
      email: authUser.email || "",
      phone: authUser.user_metadata?.phone || "",
      address: authUser.user_metadata?.address || "",
      city: authUser.user_metadata?.city || "",
      state: authUser.user_metadata?.state || "",
      pincode: authUser.user_metadata?.pincode || ""
    };

    try {
      const cached = localStorage.getItem(cachedKey);
      if (cached) {
        baseProfile = { ...baseProfile, ...JSON.parse(cached) };
      }
    } catch {}

    const supabase = createClient();
    if (supabase) {
      try {
        const { data: dbProf } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (dbProf) {
          baseProfile = {
            ...baseProfile,
            name: dbProf.name || baseProfile.name,
            phone: dbProf.phone || baseProfile.phone,
            address: dbProf.address || baseProfile.address
          };
        }
      } catch {
        // Table not migrated yet; user metadata is primary
      }
    }

    setProfile(baseProfile);
    try {
      localStorage.setItem(cachedKey, JSON.stringify(baseProfile));
    } catch {}
  }, []);

  const refreshAuth = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user || null);
      if (currentSession?.user) {
        await syncProfile(currentSession.user);
      } else {
        setProfile(null);
      }
    } catch (e) {
      console.error("Auth check error:", e);
    } finally {
      setLoading(false);
    }
  }, [syncProfile]);

  useEffect(() => {
    refreshAuth();

    const supabase = createClient();
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
      if (newSession?.user) {
        await syncProfile(newSession.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [refreshAuth, syncProfile]);

  const login = async (email: string, pass: string) => {
    const supabase = createClient();
    if (!supabase) {
      return { success: false, error: "Authentication client unavailable." };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass
    });

    if (error) {
      let friendly = error.message;
      if (error.message.includes("Invalid login credentials")) {
        friendly = "Incorrect email address or password. Please verify and try again.";
      } else if (error.message.includes("Email not confirmed")) {
        friendly = "Please verify your email address to sign in. Check your inbox for the verification link.";
      }
      return { success: false, error: friendly };
    }

    if (data.user) {
      setUser(data.user);
      setSession(data.session);
      await syncProfile(data.user);
    }

    return { success: true };
  };

  const register = async (name: string, email: string, phone: string, pass: string) => {
    const supabase = createClient();
    if (!supabase) {
      return { success: false, error: "Authentication client unavailable." };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: pass,
      options: {
        data: {
          full_name: name.trim(),
          name: name.trim(),
          phone: phone.trim()
        }
      }
    });

    if (error) {
      let friendly = error.message;
      if (error.message.includes("already registered")) {
        friendly = "An account with this email address already exists. Please sign in.";
      } else if (error.message.includes("Password should be")) {
        friendly = "Password must be at least 6 characters.";
      }
      return { success: false, error: friendly };
    }

    if (data.user) {
      setUser(data.user);
      setSession(data.session);

      // Attempt to upsert to public.profiles if table exists
      try {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role: "customer"
        });
      } catch {}

      await syncProfile(data.user);

      if (!data.session) {
        return {
          success: true,
          message: "Account created! Please check your email to verify your account."
        };
      }
    }

    return { success: true };
  };

  const logout = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const forgotPassword = async (email: string) => {
    const supabase = createClient();
    if (!supabase) {
      return { success: false, error: "Authentication client unavailable." };
    }

    const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://owlerastore.vercel.app";
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${siteUrl}/auth/callback?next=/account`
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: "Password reset link sent! Please check your email inbox."
    };
  };

  const updateProfile = async (updates: Partial<CustomerProfile>) => {
    if (!user) {
      return { success: false, error: "You must be signed in to update your profile." };
    }

    const supabase = createClient();
    if (!supabase) {
      return { success: false, error: "Authentication client unavailable." };
    }

    try {
      // 1. Update Supabase Auth User Metadata
      const { error: metaErr } = await supabase.auth.updateUser({
        data: {
          full_name: updates.name ?? profile?.name,
          phone: updates.phone ?? profile?.phone,
          address: updates.address ?? profile?.address,
          city: updates.city ?? profile?.city,
          state: updates.state ?? profile?.state,
          pincode: updates.pincode ?? profile?.pincode
        }
      });

      if (metaErr) throw metaErr;

      // 2. Try updating public.profiles table
      try {
        await supabase.from("profiles").update({
          name: updates.name,
          phone: updates.phone,
          address: updates.address
        }).eq("id", user.id);
      } catch {}

      const newProfile: CustomerProfile = {
        ...profile!,
        ...updates
      };

      setProfile(newProfile);
      localStorage.setItem(`owlera-profile-${user.id}`, JSON.stringify(newProfile));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update profile." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        updateProfile,
        refreshAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

