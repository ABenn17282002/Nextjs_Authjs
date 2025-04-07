import { NextRequest, NextResponse } from "next/server";
import { newVerification } from "@/lib/actions/verification"; //共通関数を使う！

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  const result = await newVerification(token); //中身はすべて lib に委ねる

  if (result.success) {
    return NextResponse.json({ success: result.success });
  } else {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
}
