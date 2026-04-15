import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
  href: string;
  className?: string;
}

export function AdminStatCard({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  href,
  className,
}: AdminStatCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "bg-primary/5 p-6 rounded-2xl flex flex-col justify-between h-48 transition-all hover:shadow-md group",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div className="text-left">
          <p className="text-primary text-2xl font-normal tracking-wide">{title}</p>
          <p className="text-primary text-3xl font-black tracking-tight mt-1">{value}</p>
        </div>
        <Icon size={36} strokeWidth={1} className="text-primary" />
      </div>

      <div className="flex items-center gap-1">
        <span className={cn(
          "text-xs font-bold",
          isPositive ? "text-emerald-400" : "text-rose-400"
        )}>
          {isPositive ? "+" : ""}{change}
        </span>
        <span className="text-emerald-400 text-[10px] font-medium tracking-tighter">than previous week</span>
      </div>
    </Link>
  );
}
