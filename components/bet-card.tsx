import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface BetCardProps {
  id: string;
  marketTitle: string;
  community: string;
  outcome: string;
  amount: number;
  currentValue: number;
  probability?: number;
  status?: "active" | "won" | "lost";
  endDate?: Date;
  metadata?: React.ReactNode;
}

export function BetCard({
  id,
  marketTitle,
  community,
  outcome,
  amount,
  currentValue,
  probability,
  status = "active",
  metadata,
}: BetCardProps) {
  const profit = currentValue - amount;
  const isProfit = profit > 0;

  return (
    <Link href={`/markets/${id}`} className="block">
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-border/60 hover:border-border hover:scale-[1.005]">
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2.5">
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Badge variant="secondary" className="text-xs">{community}</Badge>
                  {status !== "active" && (
                    <Badge variant={status === "won" ? "default" : "destructive"} className="text-xs">
                      {status.toUpperCase()}
                    </Badge>
                  )}
                </div>
                <h3 className="font-medium text-base mb-1 tracking-tight">{marketTitle}</h3>
                <p className="text-xs text-muted-foreground">
                  Bet on: <span className="font-medium text-foreground">{outcome}</span>
                  {probability && <span className="font-mono tabular-nums"> ({probability}%)</span>}
                </p>
              </div>
              <div className="flex items-center gap-5 text-xs">
                <div>
                  <span className="text-muted-foreground">Invested: </span>
                  <span className="font-medium font-mono tabular-nums">${amount}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Current: </span>
                  <span className="font-medium font-mono tabular-nums">${currentValue}</span>
                </div>
                <div
                  className={`font-mono tabular-nums font-medium ${isProfit ? "text-green-600" : profit < 0 ? "text-red-600" : "text-muted-foreground"}`}
                >
                  {profit > 0 ? "+" : ""}${profit}
                </div>
              </div>
            </div>
            {metadata && <div className="text-right">{metadata}</div>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}


