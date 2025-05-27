"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProfileTabsProps {
    isOAuth: boolean;
}

export default function ProfileTabs({ isOAuth }: ProfileTabsProps) {
    const pathname = usePathname();
    console.log("OAuthログインか？", isOAuth);
    const tabs = [
    { label: "Change Profile", href: "/profile/info", show: true  },
    { label: "Password Change", href: "/profile/password", show: !isOAuth },
    { label: "two-step verification", href: "/profile/two-factor", show: !isOAuth },
];

return (
  <div className="border-b border-gray-200 flex space-x-4">
    {tabs
      .filter(tab => tab.show) 
      .map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 font-medium whitespace-nowrap transition-colors duration-150 ${
              isActive
                ? "border-b-2 border-teal-500 text-teal-600"
                : "border-b-2 border-transparent text-gray-600 hover:text-black hover:border-gray-300"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
  </div>
);
}