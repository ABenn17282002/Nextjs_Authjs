import { prisma } from "@/lib/prisma"; 
import { PasswordResetToken } from "@prisma/client";

export const getPasswordResetTokenByEmail = async (
  email: string
): Promise<PasswordResetToken | null> => {
  return await prisma.passwordResetToken.findFirst({
    where: { email },
  });
};

export const getPasswordResetTokenByToken = async (
  token: string
): Promise<PasswordResetToken | null> => {
  return await prisma.passwordResetToken.findFirst({
    where: { token },
  });
};