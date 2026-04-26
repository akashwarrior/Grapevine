import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { MarketMetadata } from "./market-metadata";
import { MarketChart } from "./market-chart";
import { Market } from "@/lib/types";

interface MarketCardProps {
  market: Market;
  featured?: boolean;
}

export function MarketCard({ market, featured = false }: MarketCardProps) {
  const timeRemaining = formatDistanceToNow(market.endDate, {
    addSuffix: true,
  });

  // On-chain data (when marketAddress is available)
  const marketData = { collateral: 50, reserveNo: 100, reserveYes: 100, yesProbability: undefined, noProbability: undefined };

  const reserveYes = marketData.reserveYes ?? 0n;
  const reserveNo = marketData.reserveNo ?? 0n;
  const totalPoolOnChain = reserveYes + reserveNo;

  const yesPool =
    totalPoolOnChain > 0n
      ? Number(reserveYes)
      : market.outcomes?.[0]?.pool ?? 0;
  const noPool =
    totalPoolOnChain > 0n
      ? Number(reserveNo)
      : market.outcomes?.[1]?.pool ?? 0;

  const outcomesFromChain =
    market.marketAddress && marketData.yesProbability !== undefined
      ? [
        {
          name: "Yes",
          probability: marketData.yesProbability ?? 50,
          pool: yesPool,
        },
        {
          name: "No",
          probability: marketData.noProbability ?? 50,
          pool: noPool,
        },
      ]
      : market.outcomes;

  const totalPoolDisplay =
    totalPoolOnChain > 0n
      ? Number(totalPoolOnChain)
      : market.totalPool;

  if (featured) {
    return (
      <Link
        href={`/markets/${market.id}`}
        className="group block"
      >
        <Card className="transition-all duration-200 cursor-pointer overflow-hidden">
          <CardContent>
            <div className="grid lg:grid-cols-[2fr_3fr] gap-8 items-start">
              {/* Left side - Market info (2/5 width) */}
              <div className="space-y-4">
                <MarketMetadata
                  community={market.community}
                  timeRemaining={timeRemaining}
                />
                <h2 className="font-medium text-2xl leading-tight tracking-tight group-hover:text-primary transition-colors">
                  {market.title}
                </h2>

                <div className="space-y-3 pt-1">
                  {outcomesFromChain.slice(0, 2).map((outcome) => (
                    <div
                      key={outcome.name}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-muted-foreground">
                        {outcome.name}
                      </span>
                      <span className="text-3xl font-semibold tracking-tight tabular-nums">
                        {outcome.probability}%
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                  <div>
                    <span className="text-muted-foreground text-[11px] uppercase tracking-wider font-semibold block mb-1">
                      Volume
                    </span>
                    <span className="font-semibold text-lg font-mono tabular-nums">
                      ${totalPoolDisplay.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side - Chart (3/5 width) */}
              <div className="hidden lg:block -mb-6">
                {market.historicalData && market.historicalData.length > 0 ? (
                  <div className="h-full min-h-70 flex flex-col justify-center pr-0">
                    {/* Mini legend above chart */}
                    <div className="flex items-center gap-4 mb-3">
                      {outcomesFromChain.map((outcome, index) => {
                        const outcomeColors = ["#10b981", "#ef4444", "#fbbf24", "#06b6d4", "#8b5cf6"];
                        const color = outcomeColors[index % outcomeColors.length];
                        return (
                          <div key={outcome.name} className="flex items-center gap-2">
                            <div
                              className="w-3 h-0.5 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-xs font-medium text-muted-foreground">
                              {outcome.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex-1">
                      <MarketChart
                        outcomes={outcomesFromChain.map((outcome, index) => {
                          const outcomeColors = [
                            "#10b981",
                            "#ef4444",
                            "#fbbf24",
                            "#06b6d4",
                            "#8b5cf6",
                          ];
                          return {
                            name: outcome.name,
                            probability: outcome.probability,
                            color: outcomeColors[index % outcomeColors.length],
                          };
                        })}
                        historicalData={market.historicalData}
                        period="ALL"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-70 bg-muted/20 rounded-xl shadow-[inset_0_2px_6px_0_rgba(255,255,255,0.3),inset_0_0_0_1px_rgba(255,255,255,0.2)] flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">No chart data</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/markets/${market.id}`} className="group">
      <Card className="transition-all duration-200 cursor-pointer h-full overflow-hidden flex flex-col gap-0">
        <CardContent>
          <div className="flex-1 flex flex-col gap-3.5">
            <div className="space-y-2.5">
              <MarketMetadata
                community={market.community}
                timeRemaining={timeRemaining}
              />
              <h3 className="font-medium text-[15px] leading-snug tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                {market.title}
              </h3>
            </div>

            <div className="space-y-2 flex-1">
              {outcomesFromChain.map(({ name, probability, pool }) => (
                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-secondary/50 border border-transparent shadow-inner-card hover:shadow-inner-card-hover transition-all group">
                  <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono tabular-nums text-lg font-semibold text-foreground tracking-tight">{probability}%</span>
                    {pool !== undefined && (
                      <span className="font-mono tabular-nums text-[11px] text-muted-foreground font-medium">
                        ${pool.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3.5 mt-auto border-t border-white/10">
            <span className="text-muted-foreground text-[11px] font-medium tabular-nums">
              ${totalPoolDisplay.toLocaleString()} Vol.
            </span>
            <div className="flex items-center gap-2 text-muted-foreground/40">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

