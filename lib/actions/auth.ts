"use server";

import { RegisterSchema } from "@/lib/zod"; // バリデーションスキーマ
import { prisma } from "@/lib/prisma"; // Prisma クライアント
import { hashPassword } from "@/lib/hashFunctions"; // ハッシュ関数
import { generateVerificationToken } from "../token";
import { sendVerificationEmail } from "../mail";

// ユーザー登録のアクション
export const signUpCredentials = async (
  formData: FormData
) => {
  // Zod スキーマで検証
  const validatedFields = RegisterSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed",
      success: null,
    };
  }

  const { name, email, password } = validatedFields.data;
  const salt = crypto.randomUUID(); // ランダムなソルトを生成
  const hashedPassword = await hashPassword(password, salt);

  try {
    // データベースにユーザーを作成
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        salt,
      },
    });

    const verificationToken = await generateVerificationToken(email);
    
    console.log("Generated verificationToken:", verificationToken);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return {
      success: "User registered successfully. Please check your email for verification.",
      error: {},
      message: "",
    };

  } catch (error) {
    console.error(error);
    return { 
      error: {},
      message: "Failed to register user" ,
      success: null,
    };
  }

};

// ログインのアクション
export const signInCredentials = async (formData: FormData) => {
  try {
    // 環境変数からベース URL を取得
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error("BASE URL is not defined in environment variables");
    }

    // 絶対 URL を使用して API リクエストを送信
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error, message: result.message };
    }

    return result;
  } catch (error) {
    console.error("Login error:", error);
    return { message: "Something went wrong. Please try again later." };
  }
};


