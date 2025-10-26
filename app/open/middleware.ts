// middleware.ts
import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const url = new URL((req as any).url ?? req.toString());
  if (url.pathname === "/open") {
    const v = process.env.NEXT_PUBLIC_BUILD_ID || Date.now().toString();
    url.pathname = "/";
    url.searchParams.set("v", v);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/open"],
};
