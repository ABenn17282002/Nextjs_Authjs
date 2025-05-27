"use server";

import { prisma } from "@/lib/prisma";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export async function newVerification(token: string) {
  if (!token) {
    return { error: "Invalid token. Please check your email again." };
  }

  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist or has already been used." };
  }

  if (new Date(existingToken.expires) < new Date()) {
    return { error: "This verification link has expired. Please request a new one." };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "User does not exist. Please try again." };
  }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await prisma.verificationToken.deleteMany({
    where: { id: existingToken.id },
  });

  return { success: "Email verified successfully! You can now log in." };
}
