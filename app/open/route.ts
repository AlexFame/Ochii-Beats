// app/open/route.ts
import { NextResponse } from "next/server";

export function GET() {
  const v = process.env.NEXT_PUBLIC_BUILD_ID || Date.now().toString();
  return NextResponse.redirect(`/?v=${v}`, { status: 307 });
}
