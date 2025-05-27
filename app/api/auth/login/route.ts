import { NextRequest, NextResponse } from "next/server";
import { SignInSchema } from "@/lib/zod";
import { verifyPassword } from "@/lib/hashFunctions";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv"; // Vercel KV
import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";

// Ratelimit インスタンス（Vercel KV を使用）
const ratelimit = new Ratelimit({
  redis: kv, // Vercel KV を指定
  limiter: Ratelimit.fixedWindow(5, "15 m"), // 15分間に5回まで許可
});


export async function POST(req: NextRequest) {
  try {
    // IP アドレスを取得
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    console.log("Client IP:", ip); // デバッグ用ログ

    // レートリミットの適用
    const { success, remaining } = await ratelimit.limit(ip);
    console.log(`Rate limit remaining for IP (${ip}):`, remaining);

    if (!success) {
      return NextResponse.json(
        { message: "Too many login attempts. Please try again after 15 minutes." },
        { status: 429 }
      );
    }

    // リクエストボディを取得
    const body = await req.json();
    const validatedFields = SignInSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: validatedFields.error.flatten().fieldErrors, message: "Invalid input data." },
        { status: 400 }
      );
    }

    const { email, password } = validatedFields.data;
    // ユーザーをデータベースから取得
    const user = await getUserByEmail(email);


    if (!user || !user.password || !user.salt) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { message: "Email not verified. Please check your inbox." },
        { status: 403 }
      );
    }

    const isPasswordValid = await verifyPassword(password, user.salt, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const result = await signIn("credentials", { email, password, redirect: false });

    if (!result) {
      return NextResponse.json({ message: "Login failed" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful", redirectTo: "/dashboard" });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}