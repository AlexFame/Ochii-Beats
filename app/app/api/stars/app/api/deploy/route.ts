import { NextResponse } from "next/server";

export async function POST() {
  try {
    const hook = process.env.VERCEL_DEPLOY_HOOK;
    if (!hook) return NextResponse.json({ error: "VERCEL_DEPLOY_HOOK not set" }, { status: 500 });

    const r = await fetch(hook, { method: "POST" });
    if (!r.ok) return NextResponse.json({ error: "Hook call failed", status: r.status }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "deploy error" }, { status: 500 });
  }
}
