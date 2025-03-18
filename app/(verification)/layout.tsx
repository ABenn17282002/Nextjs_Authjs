import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "New Verification",
  description: "New Verification Page",
};

export default function VerificationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>{children}</main>
  );
}