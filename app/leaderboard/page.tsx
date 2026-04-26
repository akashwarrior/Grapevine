"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, TrendingUp, Target } from "lucide-react";

export default function LeaderboardPage() {
  // Mock data
  const topPredictors = [
    {
      rank: 1,
      address: "0xabcd...ef01",
      username: "CryptoOracle",
      accuracy: 87,
      totalBets: 156,
      profit: 2450,
      reputation: 950,
    },
    {
      rank: 2,
      address: "0x2345...6789",
      username: "MarketMaven",
      accuracy: 84,
      totalBets: 203,
      profit: 2180,
      reputation: 890,
    },
    {
      rank: 3,
      address: "0x9876...5432",
      username: "PredictorPro",
      accuracy: 82,
      totalBets: 178,
      profit: 1920,
      reputation: 850,
    },
    {
      rank: 4,
      address: "0x3456...7890",
      username: "BetMaster",
      accuracy: 81,
      totalBets: 145,
      profit: 1750,
      reputation: 820,
    },
    {
      rank: 5,
      address: "0x5678...1234",
      username: "FutureSeer",
      accuracy: 79,
      totalBets: 167,
      profit: 1580,
      reputation: 780,
    },
  ];

  const topCommunities = [
    {
      rank: 1,
      name: "Columbia CS",
      totalVolume: 125000,
      markets: 45,
      members: 567,
    },
    {
      rank: 2,
      name: "Columbia Athletics",
      totalVolume: 98000,
      markets: 32,
      members: 412,
    },
    {
      rank: 3,
      name: "Columbia Engineering",
      totalVolume: 87000,
      markets: 38,
      members: 389,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden animated-gradient border-b border-border/50">
        <div className="container mx-auto px-6 py-8 md:py-10">
          <div className="max-w-3xl mx-auto text-center space-y-3 fade-in">
            <div className="flex items-center justify-center gap-3 mb-1">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tighter">Leaderboard</h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Top predictors and most active communities
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <Tabs defaultValue="predictors" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
            <TabsTrigger value="predictors" className="font-medium">Top Predictors</TabsTrigger>
            <TabsTrigger value="communities" className="font-medium">Top Communities</TabsTrigger>
          </TabsList>

          <TabsContent value="predictors" className="mt-10">
            <div className="space-y-4 max-w-5xl mx-auto">
              {topPredictors.map((user) => (
                <Card
                  key={user.rank}
                  className={`p-6 border-border/50 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm ${user.rank <= 3 ? "border-2 border-primary/30 shadow-md" : ""
                    }`}
                >
                  <div className="flex items-center gap-6">
                    {/* Rank */}
                    <div className="shrink-0">
                      {user.rank <= 3 ? (
                        <div className="relative">
                          <Trophy
                            className={`h-8 w-8 ${user.rank === 1
                              ? "text-yellow-500"
                              : user.rank === 2
                                ? "text-gray-400"
                                : "text-amber-600"
                              }`}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                            {user.rank}
                          </span>
                        </div>
                      ) : (
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-muted font-medium">
                          {user.rank}
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {user.address}
                        </div>
                      </div>
                      {user.rank <= 3 && (
                        <Badge variant="secondary" className="ml-2">
                          Top {user.rank}
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="hidden md:flex items-center gap-8 text-sm">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <Target className="h-3 w-3" />
                          <span>Accuracy</span>
                        </div>
                        <div className="font-medium">{user.accuracy}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground mb-1">Bets</div>
                        <div className="font-medium">{user.totalBets}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>Profit</span>
                        </div>
                        <div className="font-medium text-green-600">
                          ${user.profit.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground mb-1">Reputation</div>
                        <div className="font-medium">{user.reputation}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="communities" className="mt-10">
            <div className="space-y-4 max-w-5xl mx-auto">
              {topCommunities.map((community) => (
                <Card
                  key={community.rank}
                  className={`p-6 border-border/50 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm ${community.rank <= 3 ? "border-2 border-primary/30 shadow-md" : ""
                    }`}
                >
                  <div className="flex items-center gap-6">
                    {/* Rank */}
                    <div className="shrink-0">
                      {community.rank <= 3 ? (
                        <div className="relative">
                          <Trophy
                            className={`h-8 w-8 ${community.rank === 1
                              ? "text-yellow-500"
                              : community.rank === 2
                                ? "text-gray-400"
                                : "text-amber-600"
                              }`}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                            {community.rank}
                          </span>
                        </div>
                      ) : (
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-muted font-medium">
                          {community.rank}
                        </div>
                      )}
                    </div>

                    {/* Community Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="font-medium text-lg">{community.name}</div>
                        {community.rank <= 3 && (
                          <Badge variant="secondary">Top {community.rank}</Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden md:flex items-center gap-8 text-sm">
                      <div className="text-center">
                        <div className="text-muted-foreground mb-1">Total Volume</div>
                        <div className="font-medium">
                          ${(community.totalVolume / 1000).toFixed(0)}k
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground mb-1">Markets</div>
                        <div className="font-medium">{community.markets}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground mb-1">Members</div>
                        <div className="font-medium">{community.members}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
