"use server";

import { z } from "zod";
import { ResetPasswordSchema } from "@/lib/zod";
import { hashPassword } from "@/lib/hashFunctions"; 
import { prisma } from "@/lib/prisma"; 
import { getUserByEmail } from "@/data/user";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";

export const reset = async (
  values: z.infer<typeof ResetPasswordSchema> & { token: string | null }
) => {
  const { password, token } = values;

  if (!token) return { error: "Missing token!" };

  const resetToken = await getPasswordResetTokenByToken(token);
  console.log("現在:", new Date());
  console.log("トークン期限:", resetToken?.expires);

  if (!resetToken || resetToken.expires < new Date()) {
    return { error: "Token is invalid or expired." };
  }

  const user = await getUserByEmail(resetToken.email);
  if (!user) return { error: "User not found." };

  const salt = crypto.randomUUID(); 
  const hashedPassword = await hashPassword(password, salt);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      salt: salt,
    },
  });

  await prisma.passwordResetToken.delete({
    where: { id: resetToken.id },
  });

  return { success: "Password has been reset." };
};
