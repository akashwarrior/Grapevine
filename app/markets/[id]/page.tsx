"use client";

import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Clock,
  TrendingUp,
  Loader2,
  Wallet,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MarketChart } from "@/components/markets/market-chart";
import { ALL_MARKETS } from "@/lib/constant";

const TOKEN_SYMBOL = "tUSDC";
const DEMO_BALANCE = 1000;
const DEMO_IS_CONNECTED = true;
const DEMO_IS_ON_CHAIN_MARKET = true;

/**
 * Market detail page - shows market information and betting interface
 *
 * Note: In Next.js 15+, params is a Promise and must be unwrapped with React.use()
 */
export default function MarketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap the params Promise (Next.js 15+ requirement)
  const { id } = use(params);
  const market = ALL_MARKETS.find((market) => market.id === id);

  const [betAmount, setBetAmount] = useState("10");
  const [seedAmount, setSeedAmount] = useState("100");
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [chartPeriod, setChartPeriod] = useState("ALL");
  const [txStatus, setTxStatus] = useState<
    | "idle"
    | "approving"
    | "trading"
    | "seeding"
    | "minting"
    | "success"
    | "error"
  >("idle");
  const [txMessage, setTxMessage] = useState("");
  const [isMinting, setIsMinting] = useState(false);

  const relatedMarkets = market
    ? ALL_MARKETS.filter((relatedMarket) => relatedMarket.id !== id).slice(0, 3)
    : [];
  const outcomes = market?.outcomes.map((outcome) => ({ title: outcome.name })) || [];
  const recentBets = market
    ? [
        {
          user: "0x8f24...a91b",
          outcome: market.outcomes[0]?.name || "Yes",
          amount: "$42",
          timestamp: new Date("2025-10-01T14:42:00Z"),
        },
        {
          user: "0x51d8...4c02",
          outcome: market.outcomes[1]?.name || "No",
          amount: "$27",
          timestamp: new Date("2025-10-01T12:00:00Z"),
        },
      ]
    : [];
  const parsedBetAmount = Number.parseFloat(betAmount);
  const betAmountValue =
    Number.isFinite(parsedBetAmount) && parsedBetAmount > 0 ? parsedBetAmount : 0;
  const parsedSeedAmount = Number.parseFloat(seedAmount);
  const seedAmountValue =
    Number.isFinite(parsedSeedAmount) && parsedSeedAmount > 0 ? parsedSeedAmount : 0;

  // Check if pool needs seeding - disabled for demo mode
  // const needsSeeding = false;// Always show trading UI for demo
  const needsSeeding = false;

  // Check if connected user is the market creator
  const isCreator = true;
  const isConnected = DEMO_IS_CONNECTED;
  const isOnChainMarket = DEMO_IS_ON_CHAIN_MARKET;

  // Check trading state - enabled for demo mode
  const isTradingOpen = true;
  const isTradePending = txStatus === "approving" || txStatus === "trading";

  // Format user balances - use TestUSDC balance when connected
  const formattedCollateralBalance = DEMO_BALANCE.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedYesBalance = "12.50";
  const formattedNoBalance = "8.25";

  // Format expected tokens out - show demo estimate if no quote available
  const selectedProbability =
    selectedOutcome !== null ? market?.outcomes[selectedOutcome]?.probability : undefined;
  const expectedTokensOut =
    selectedProbability && betAmountValue > 0
      ? (betAmountValue / Math.max(selectedProbability / 100, 0.01)).toFixed(2)
      : "0.00";

  // Handle trade execution
  const handlePlaceBet = async () => {
    if (selectedOutcome === null) {
      setTxStatus("error");
      setTxMessage("Please select Yes or No");
      return;
    }

    if (!market) {
      setTxStatus("error");
      setTxMessage("Market data is unavailable");
      return;
    }

    if (betAmountValue <= 0) {
      setTxStatus("error");
      setTxMessage("Please enter an amount");
      return;
    }

    try {
      const outcomeName = outcomes[selectedOutcome]?.title || "outcome";
      setTxStatus("success");
      setTxMessage(
        `Demo order ready: ${betAmountValue.toLocaleString()} ${TOKEN_SYMBOL} on ${outcomeName}.`
      );
    } catch (error: unknown) {
      console.error("Trade error:", error);
      setTxStatus("error");
      setTxMessage(error instanceof Error ? error.message : "Trade failed");
    }
  };

  const handleSeedLiquidity = async () => {
    if (!isCreator) {
      setTxStatus("error");
      setTxMessage("Only the market creator can seed liquidity");
      return;
    }

    if (seedAmountValue <= 0) {
      setTxStatus("error");
      setTxMessage("Please enter a seed amount");
      return;
    }

    try {
      setTxStatus("success");
      setTxMessage(
        `Demo liquidity prepared: ${seedAmountValue.toLocaleString()} ${TOKEN_SYMBOL}.`
      );
    } catch (error: unknown) {
      console.error("Seed error:", error);
      setTxStatus("error");
      setTxMessage(error instanceof Error ? error.message : "Seeding failed");
    }
  };

  const handleMintTestTokens = async () => {
    try {
      setIsMinting(true);
      setTxStatus("success");
      setTxMessage(`Demo balance refreshed with 1000 ${TOKEN_SYMBOL}.`);
      setIsMinting(false);
    } catch (error: unknown) {
      console.error("Mint error:", error);
      setTxStatus("error");
      setTxMessage(error instanceof Error ? error.message : "Minting failed");
      setIsMinting(false);
    }
  };

  // Assign colors to outcomes - vibrant Polymarket-style palette
  const outcomeColors = [
    "#ff6b35", // Vibrant orange
    "#4ecdc4", // Turquoise
    "#ffe66d", // Bright yellow
    "#a8dadc", // Light blue
    "#c77dff", // Purple
    "#06ffa5", // Mint green
    "#ff006e", // Hot pink
  ];
  const getOutcomeColor = (index: number) =>
    outcomeColors[index % outcomeColors.length];

  if (!market) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-3xl px-4 py-12">
          <Link
            href="/markets"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Markets
          </Link>
          <Card className="p-8 border-border/50 text-center">
            <h1 className="text-2xl font-medium mb-2">Market not found</h1>
            <p className="text-sm text-muted-foreground">
              This market id does not match any local demo market.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header Section */}
        <div className="mb-6">
          <Link
            href="/markets"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Markets
          </Link>

          <div className="flex items-start justify-between gap-6 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-medium mb-3">
                {market.title}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    ${market.totalPool.toLocaleString()} Vol.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {market.endDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Main Content Area */}
          <div className="space-y-6">
            {/* Chart Section */}
            <Card className="p-6 bg-card border-border/40">
              {/* Legend above chart - Polymarket style */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/30">
                <div className="flex items-center flex-wrap gap-4">
                  {market.outcomes.map((outcome, index) => (
                    <div key={outcome.name} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: getOutcomeColor(index) }}
                      />
                      <span className="text-sm font-medium text-muted-foreground">
                        {outcome.name} {outcome.probability.toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Chart Controls */}
                <div className="flex items-center gap-2">
                  {["1H", "6H", "1D", "1W", "1M", "ALL"].map((period) => (
                    <button
                      key={period}
                      onClick={() => setChartPeriod(period)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${chartPeriod === period
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <MarketChart
                outcomes={market.outcomes.map((outcome, index) => ({
                  name: outcome.name,
                  probability: outcome.probability,
                  color: getOutcomeColor(index),
                }))}
                historicalData={market.historicalData}
                period={chartPeriod}
              />
            </Card>

            {/* Outcomes Section - Clean display without buttons */}
            <Card className="p-6 bg-card border-border/40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg">Current Odds</h3>
              </div>
              <div className="space-y-3">
                {market.outcomes.map((outcome, index) => (
                  <div
                    key={outcome.name}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-background/50 cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => setSelectedOutcome(index)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getOutcomeColor(index) }}
                      />
                      <span className="font-medium">{outcome.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {outcome.pool.toLocaleString()} Vol.
                      </span>
                      <span
                        className="text-2xl font-semibold"
                        style={{ color: getOutcomeColor(index) }}
                      >
                        {outcome.probability.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>
              <TabsContent value="activity" className="mt-6 space-y-4">
                {recentBets.map((bet, index) => (
                  <Card key={index} className="p-4 border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{bet.user.slice(2, 4)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{bet.user}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(bet.timestamp, {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{bet.amount}</div>
                        <div className="text-xs text-muted-foreground">
                          on {bet.outcome}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="details" className="mt-6">
                <Card className="p-6 border-border/50">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Creator
                      </div>
                      <div className="font-mono text-sm">
                        {market.creator || "0x7a42...91cf"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Created
                      </div>
                      <div>
                        {(market.createdDate || new Date("2025-09-15")).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Resolution Source
                      </div>
                      <div>
                        {market.resolutionSource ||
                          `${market.community} official update`}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Resolution Date
                      </div>
                      <div>
                        {(market.resolutionDate || market.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="discussion" className="mt-6">
                <Card className="p-6 border-border/50">
                  <p className="text-muted-foreground text-center py-8">
                    Discussion feature coming soon
                  </p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Betting Interface */}
          <div className="lg:sticky lg:top-6 h-fit">
            <Card className="overflow-hidden bg-card border-border/40">
              {/* Header with Market Image and Title */}
              <div className="relative h-24 bg-linear-to-br from-muted/30 to-muted/10 border-b border-border/30 px-5 pt-5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-background/80 border border-border/40 flex items-center justify-center overflow-hidden">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-xs font-medium">
                        {market.title.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2 leading-snug">
                      {market.title.length > 45
                        ? market.title.slice(0, 45) + "..."
                        : market.title}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {/* Buy/Sell Tabs */}
                <div className="flex gap-2 mb-5">
                  <button
                    onClick={() => setActiveTab("buy")}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "buy"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setActiveTab("sell")}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === "sell"
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Sell
                  </button>
                </div>

                {/* Seed Liquidity Section - Only for creator when pool is empty */}
                {isCreator && (
                  <div className="mb-5 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-500 mb-3">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Seed Liquidity Required
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      As the market creator, you need to seed initial liquidity
                      before trading can begin.
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>
                        Balance: {formattedCollateralBalance} {TOKEN_SYMBOL}
                      </span>
                      <button
                        onClick={handleMintTestTokens}
                        disabled={isMinting}
                        className="text-blue-500 hover:text-blue-400 underline disabled:opacity-50"
                      >
                        {isMinting ? "Minting..." : "Get Test Tokens"}
                      </button>
                    </div>
                    <div className="relative mb-3">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground pointer-events-none">
                        {TOKEN_SYMBOL}
                      </span>
                      <Input
                        type="number"
                        placeholder="100"
                        value={seedAmount}
                        onChange={(e) => setSeedAmount(e.target.value)}
                        className="h-10 pl-16 text-right bg-background"
                        disabled={txStatus === "seeding"}
                      />
                    </div>
                    <Button
                      onClick={handleSeedLiquidity}
                      disabled={
                        seedAmountValue <= 0 ||
                        txStatus === "seeding"
                      }
                      className="w-full bg-amber-500 hover:bg-amber-600 text-black shadow-[inset_0_2px_4px_0_rgba(255,200,50,0.5)] hover:shadow-[inset_0_2px_6px_0_rgba(255,210,80,0.6)]"
                    >
                      {txStatus === "seeding" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {true ? "Approving..." : "Seeding..."}
                        </>
                      ) : (
                        "Seed Liquidity"
                      )}
                    </Button>
                  </div>
                )}

                {/* Notice when pool needs seeding but user is not creator */}
                {needsSeeding && !isCreator && (
                  <div className="mb-5 p-4 bg-muted/30 border border-border/30 rounded-lg text-center">
                    <Clock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Waiting for market creator to seed liquidity
                    </p>
                  </div>
                )}

                {/* Outcome Selection - Simple Yes/No buttons */}
                <>
                  <div className="grid grid-cols-2 gap-2 mb-5">
                      <button
                        onClick={() => setSelectedOutcome(0)}
                        className={`p-4 rounded-lg transition-all font-medium ${selectedOutcome === 0
                          ? "bg-green-600 text-white ring-2 ring-green-400 shadow-[inset_0_2px_4px_0_rgba(100,255,150,0.4)]"
                          : "bg-secondary text-foreground border border-border/40 shadow-[inset_0_1px_3px_0_rgba(255,255,255,0.5)] hover:shadow-[inset_0_1px_4px_0_rgba(255,255,255,0.6)]"
                          }`}
                      >
                        <div className="text-2xl mb-1">
                          {market.outcomes[0].name}
                        </div>
                        <div className="text-sm opacity-80">
                          {market.outcomes[0].probability.toFixed(2)}%
                        </div>
                      </button>
                      <button
                        onClick={() => setSelectedOutcome(1)}
                        className={`p-4 rounded-lg transition-all font-medium ${selectedOutcome === 1
                          ? "bg-red-600 text-white ring-2 ring-red-400 shadow-[inset_0_2px_4px_0_rgba(255,120,120,0.4)]"
                          : "bg-secondary text-foreground border border-border/40 shadow-[inset_0_1px_3px_0_rgba(255,255,255,0.5)] hover:shadow-[inset_0_1px_4px_0_rgba(255,255,255,0.6)]"
                          }`}
                      >
                        <div className="text-2xl mb-1">
                          {market.outcomes[1].name}
                        </div>
                        <div className="text-sm opacity-80">
                          {market.outcomes[1].probability.toFixed(2)}%
                        </div>
                      </button>
                    </div>

                    {/* Amount Input - Compact */}
                    <div className="mb-4">
                      <label className="text-sm font-medium mb-2 block text-muted-foreground">
                        Amount
                      </label>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>
                          Balance: {formattedCollateralBalance} {TOKEN_SYMBOL}
                        </span>
                        <button
                          onClick={isConnected ? handleMintTestTokens : undefined}
                          disabled={isMinting}
                          className={`${isConnected
                            ? "text-blue-500 hover:text-blue-400 underline"
                            : "text-muted-foreground"
                            } disabled:opacity-50`}
                        >
                          {isMinting
                            ? "Minting..."
                            : isConnected
                              ? "Get Test Tokens"
                              : "Connect wallet for test tokens"}
                        </button>
                      </div>
                      <div className="relative mb-3">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground pointer-events-none">
                          {TOKEN_SYMBOL}
                        </span>
                        <Input
                          type="number"
                          placeholder="0"
                          value={betAmount}
                          onChange={(e) => setBetAmount(e.target.value)}
                          className="text-2xl font-medium h-14 pl-16 pr-3 text-right bg-muted/30 border-border/60"
                        />
                      </div>

                      {/* Quick Amount Buttons - Compact */}
                      <div className="grid grid-cols-4 gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            setBetAmount((prev) =>
                              (parseFloat(prev || "0") + 1).toString()
                            )
                          }
                          className="text-xs h-9"
                        >
                          +$1
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            setBetAmount((prev) =>
                              (parseFloat(prev || "0") + 20).toString()
                            )
                          }
                          className="text-xs h-9"
                        >
                          +$20
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            setBetAmount((prev) =>
                              (parseFloat(prev || "0") + 100).toString()
                            )
                          }
                          className="text-xs h-9"
                        >
                          +$100
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setBetAmount(DEMO_BALANCE.toString());
                          }}
                          className="text-xs h-9"
                        >
                          Max
                        </Button>
                      </div>
                    </div>

                    {/* Expected Output */}
                    {selectedOutcome !== null && (
                      <div className="mb-4 p-3 bg-muted/20 rounded-lg border border-border/30">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Expected tokens:
                          </span>
                          <span className="font-medium">
                            {expectedTokensOut}{" "}
                            {outcomes[selectedOutcome]?.title}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Your Positions */}
                    {isConnected && (
                      <div className="mb-4 p-3 bg-muted/20 rounded-lg border border-border/30">
                        <div className="text-xs text-muted-foreground mb-2">
                          Your Positions
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{outcomes[0]?.title} tokens:</span>
                          <span className="font-medium text-green-500">
                            {formattedYesBalance}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span>{outcomes[1]?.title} tokens:</span>
                          <span className="font-medium text-red-500">
                            {formattedNoBalance}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Transaction Status */}
                    {txStatus !== "idle" && (
                      <div
                        className={`mb-4 p-3 rounded-lg border flex items-center gap-2 ${txStatus === "success"
                          ? "bg-green-500/10 border-green-500/30 text-green-500"
                          : txStatus === "error"
                            ? "bg-red-500/10 border-red-500/30 text-red-500"
                            : "bg-blue-500/10 border-blue-500/30 text-blue-500"
                          }`}
                      >
                        {txStatus === "approving" || txStatus === "trading" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : txStatus === "success" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        <span className="text-sm">{txMessage}</span>
                      </div>
                    )}

                    {!isConnected ? (
                      <div className="mb-5 p-3 bg-muted/30 rounded-lg border border-border/30 text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Wallet className="h-4 w-4" />
                          <span>Connect wallet to trade</span>
                        </div>
                      </div>
                    ) : !isOnChainMarket ? (
                      <div className="mb-5 p-3 bg-muted/30 rounded-lg border border-border/30 text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <AlertCircle className="h-4 w-4" />
                          <span>Demo market - trading disabled</span>
                        </div>
                      </div>
                    ) : null}
                    {!isTradingOpen ? (
                      <div className="mb-5 p-3 bg-muted/30 rounded-lg border border-border/30 text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Trading closed</span>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={handlePlaceBet}
                        disabled={
                          selectedOutcome === null ||
                          betAmountValue <= 0
                        }
                        className={`w-full h-12 text-base font-medium mb-5 ${selectedOutcome === 0
                          ? "bg-green-600 hover:bg-green-700 shadow-[inset_0_2px_4px_0_rgba(100,255,150,0.4)] hover:shadow-[inset_0_2px_6px_0_rgba(120,255,170,0.5)]"
                          : selectedOutcome === 1
                            ? "bg-red-600 hover:bg-red-700 shadow-[inset_0_2px_4px_0_rgba(255,120,120,0.4)] hover:shadow-[inset_0_2px_6px_0_rgba(255,150,150,0.5)]"
                            : ""
                          }`}
                      >
                        {isTradePending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : selectedOutcome !== null ? (
                          `Buy ${outcomes[selectedOutcome]?.title}`
                        ) : (
                          "Select Yes or No"
                        )}
                      </Button>
                    )}
                </>

                {/* Terms - Compact */}
                <p className="text-xs text-center text-muted-foreground mb-5">
                  By trading, you agree to the{" "}
                  <Link
                    href="/terms"
                    className="underline hover:text-foreground"
                  >
                    Terms of Use
                  </Link>
                  .
                </p>

                {/* Related Markets - Compact */}
                <div className="pt-5 border-t border-border/30">
                  <h4 className="text-sm font-medium mb-4 text-muted-foreground">
                    Related Markets
                  </h4>
                  <div className="space-y-3">
                    {relatedMarkets.map((relatedMarket) => (
                      <Link
                        key={relatedMarket.id}
                        href={`/markets/${relatedMarket.id}`}
                        className="block p-3 rounded-lg border border-border/40 hover:border-border transition-colors bg-background/50"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-2 mb-1">
                              {relatedMarket.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {relatedMarket.community}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <div
                              className="text-lg font-medium"
                              style={{ color: getOutcomeColor(0) }}
                            >
                              {relatedMarket.outcomes[0].probability}%
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
