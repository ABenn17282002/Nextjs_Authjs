import ProfileTabs from "@/components/auth/ProfileTabs"; // プロフィールタブコンポーネント
import { auth } from "@/auth"; // NextAuth の getServerSession 相当
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { accounts: true }, // OAuth情報を含める
  });

  if (!user) redirect("/login");

  const isOAuth = user.accounts.length > 0;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">アカウント設定</h1>
      <ProfileTabs isOAuth={isOAuth} />
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}