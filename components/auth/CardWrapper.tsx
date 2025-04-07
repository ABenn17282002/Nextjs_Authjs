import { ReactNode } from "react";
import CardHeader from "./CardHeader";

interface CardWrapperProps {
  headerLabel: string;
  backButtonHref: string;
  backButtonLabel: string;
  children: ReactNode;
}

export default function CardWrapper({
  headerLabel,
  backButtonHref,
  backButtonLabel,
  children,
}: CardWrapperProps) {
  return (
    <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md text-center">
      <CardHeader title="Auth" label={headerLabel} />
      <div className="mt-4">{children}</div>
      <a href={backButtonHref} className="block mt-4 text-blue-500 hover:underline">
        {backButtonLabel}
      </a>
    </div>
  );
}
