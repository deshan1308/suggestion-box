import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase";

function createLegacyTrackingCode() {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `HRX-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const suggestion = String(body.suggestion ?? "").trim();

    if (!suggestion) {
      return NextResponse.json(
        { error: "Suggestion is required." },
        { status: 400 },
      );
    }

    const supabase = await getSupabaseServerClient();

    const { error } = await supabase.from("suggestions").insert({
      suggestion,
      status: "New",
    });

    if (!error) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    if (error.message.includes("tracking_code")) {
      const fallback = await supabase.from("suggestions").insert({
        suggestion,
        status: "New",
        tracking_code: createLegacyTrackingCode(),
      });

      if (fallback.error) {
        return NextResponse.json({ error: fallback.error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true }, { status: 201 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!verifyAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("suggestions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ suggestions: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
