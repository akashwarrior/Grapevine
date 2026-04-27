"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { StatCard } from "@/components/stat-card";
import { BetCard } from "@/components/bet-card";

export default function PortfolioPage() {
  // Mock user data
  const portfolio = {
    totalValue: 2450,
    totalInvested: 2000,
    profitLoss: 450,
    profitLossPercent: 22.5,
    activeBets: 8,
    wonBets: 12,
    lostBets: 3,
    accuracy: 80,
  };

  // Mock active bets
  const activeBets = [
    {
      id: "1",
      marketTitle: "Will the CS Final Exam average be above 85%?",
      community: "Columbia CS",
      outcome: "Yes",
      amount: 100,
      currentValue: 125,
      probability: 65,
      endDate: new Date("2025-12-15"),
    },
    {
      id: "2",
      marketTitle: "Student Council President Election Winner",
      community: "Columbia Governance",
      outcome: "Sarah Chen",
      amount: 200,
      currentValue: 220,
      probability: 45,
      endDate: new Date("2025-11-20"),
    },
    {
      id: "3",
      marketTitle: "Will the Basketball Team make playoffs?",
      community: "Columbia Athletics",
      outcome: "Yes",
      amount: 150,
      currentValue: 160,
      probability: 72,
      endDate: new Date("2025-12-01"),
    },
  ];

  // Mock bet history
  const betHistory = [
    {
      id: "4",
      marketTitle: "Will the Midterm average be above 75%?",
      community: "Columbia CS",
      outcome: "Yes",
      amount: 80,
      finalValue: 120,
      profit: 40,
      status: "won",
      resolvedDate: new Date("2025-10-15"),
    },
    {
      id: "5",
      marketTitle: "Campus WiFi Upgrade Completion Date",
      community: "Columbia Campus Life",
      outcome: "Before November",
      amount: 50,
      finalValue: 0,
      profit: -50,
      status: "lost",
      resolvedDate: new Date("2025-10-10"),
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-medium mb-3">Portfolio</h1>
        <p className="text-muted-foreground text-lg">
          Track your predictions and performance
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          label="Total Value"
          value={`$${portfolio.totalValue.toLocaleString()}`}
          subtext={`${portfolio.profitLoss >= 0 ? '+' : ''}${portfolio.profitLossPercent}%`}
          icon={DollarSign}
        />
        <StatCard
          label="Profit/Loss"
          value={`${portfolio.profitLoss >= 0 ? '+' : ''}$${Math.abs(portfolio.profitLoss)}`}
          subtext={`$${portfolio.totalInvested} invested`}
          icon={portfolio.profitLoss >= 0 ? TrendingUp : TrendingDown}
          valueColor={portfolio.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}
        />
        <StatCard
          label="Active Bets"
          value={portfolio.activeBets}
          subtext={`${portfolio.wonBets} won · ${portfolio.lostBets} lost`}
          icon={TrendingUp}
        />
        <StatCard
          label="Accuracy"
          value={`${portfolio.accuracy}%`}
          subtext={`${portfolio.wonBets} / ${portfolio.wonBets + portfolio.lostBets} resolved`}
          icon={Target}
        />
      </div>

      {/* Tabs for Active Bets and History */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Bets ({activeBets.length})</TabsTrigger>
          <TabsTrigger value="history">History ({betHistory.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6 space-y-4">
          {activeBets.map((bet) => (
            <BetCard
              key={bet.id}
              id={bet.id}
              marketTitle={bet.marketTitle}
              community={bet.community}
              outcome={bet.outcome}
              amount={bet.amount}
              currentValue={bet.currentValue}
              probability={bet.probability}
              status="active"
              metadata={
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Ends</div>
                  <div className="font-medium">
                    {formatDistanceToNow(bet.endDate, { addSuffix: true })}
                  </div>
                </div>
              }
            />
          ))}
        </TabsContent>

        <TabsContent value="history" className="mt-6 space-y-4">
          {betHistory.map((bet) => (
            <BetCard
              key={bet.id}
              id={bet.id}
              marketTitle={bet.marketTitle}
              community={bet.community}
              outcome={bet.outcome}
              amount={bet.amount}
              currentValue={bet.finalValue}
              status={bet.status as "won" | "lost"}
              metadata={
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Resolved</div>
                  <div className="text-sm">{bet.resolvedDate.toLocaleDateString()}</div>
                </div>
              }
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

