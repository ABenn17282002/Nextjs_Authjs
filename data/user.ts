import { prisma } from "@/lib/prisma"; 
import { auth } from "@/auth";
import { redirect } from "next/navigation"; 

export const getUsers = async () => {
  const session = await auth(); 
  if (!session || !session.user || session.user.role !== "admin") {
    redirect("/dashboard"); 
  }

  try {
    const users = await prisma.user.findMany();
    return users; 
  } catch (error) {
    console.log(error); 
  }
};

export const getUserByEmail = async (email: string) => {
  try {
      const users = await prisma.user.findMany();
      console.log("Prisma users:", users.map(u => u.email));

      const user = await prisma.user.findFirst({
        where: { email },
      });
      console.log("user result:", user);

      return user;
  } catch (error) {
      console.error("getUserByEmail error:", error);
      return null;
  }
};


export const getUserById = async (id: string) => {
  try {
      const user = await prisma.user.findUnique({ where: { id } });
      return user;
  } catch {
      return null;
  }
};