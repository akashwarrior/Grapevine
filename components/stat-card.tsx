import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  valueColor?: string;
}

export function StatCard({ label, value, subtext, icon: Icon, trend, valueColor }: StatCardProps) {
  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-border/20">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">{label}</div>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />}
        </div>
        <div className={`text-3xl font-mono tabular-nums font-semibold tracking-tight mb-1.5 ${valueColor || ''}`}>
          {value}
        </div>
        {subtext && (
          <div className="text-[13px] text-muted-foreground font-medium">
            {subtext}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


