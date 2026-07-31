import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      message:
        "Endpoint preparado. El envío real de leads se implementará más adelante.",
    },
    { status: 501 }
  );
}