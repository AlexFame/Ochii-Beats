import { NextResponse } from "next/server";

export async function POST() {
  try {
    const hook = process.env.VERCEL_DEPLOY_HOOK;
    if (!hook) {
      return NextResponse.json({ error: "Missing VERCEL_DEPLOY_HOOK" }, { status: 500 });
    }

    const r = await fetch(hook, { method: "POST" });
    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      return NextResponse.json({ error: `Hook failed: ${r.status} ${txt}` }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Deploy error" }, { status: 500 });
  }
}
