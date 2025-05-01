"use server";

import { z } from "zod";
import { resetSchema } from "@/lib/zod"
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "../token";
import { sendPasswordResetEmail } from "../mail";

export async function reset(values: z.infer<typeof resetSchema>) {
    // 入力バリデーション
    const validatedFields = resetSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid email address." };
    }
  
    const { email } = validatedFields.data;
  
    // ユーザーの存在確認
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return { error: "Email address not found." };
    }
  
    // リセットトークン生成
    const passwordResetToken = await generatePasswordResetToken(email);
    // メール送信
    await sendPasswordResetEmail(
      passwordResetToken.email, 
      passwordResetToken.token
    );
  
    return { success: "Password reset email sent." };
}