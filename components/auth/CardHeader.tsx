import { cn } from "@/lib/utils"; // cnライブラリを使用（clsx や classnames のエイリアス）

interface HeaderProps {
  title: string;
  label: string;
  className?: string;
}

export default function Header({ title, label, className }: HeaderProps) {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className={cn("text-3xl font-semibold", className)}>
        <span>🔒</span> {title}
      </h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}