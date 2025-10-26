import { NextResponse } from "next/server";

type Body = {
  title: string;
  description: string;
  payload: string;
  amountStars: number;
};

export async function POST(req: Request) {
  try {
    const botToken = process.env.BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json({ error: "BOT_TOKEN not set" }, { status: 500 });
    }

    const { title, description, payload, amountStars } = (await req.json()) as Body;

    const resp = await fetch(`https://api.telegram.org/bot${botToken}/createInvoiceLink`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        payload,
        currency: "XTR",
        prices: [{ label: title, amount: amountStars }],
      }),
    });

    const data = await resp.json();
    if (!data.ok) {
      return NextResponse.json({ error: data.description ?? "createInvoiceLink failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, url: data.result });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}
