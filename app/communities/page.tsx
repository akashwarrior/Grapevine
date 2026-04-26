"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, TrendingUp, Users, Plus } from "lucide-react";

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const communities = [
    {
      id: "1",
      name: "Columbia CS",
      slug: "columbia-cs",
      description: "Computer Science Department prediction markets",
      avatar: "CS",
      members: 234,
      activeMarkets: 12,
      totalVolume: 45600,
      verified: true,
    },
    {
      id: "2",
      name: "Columbia Governance",
      slug: "columbia-governance",
      description: "Student governance and election predictions",
      avatar: "CG",
      members: 189,
      activeMarkets: 5,
      totalVolume: 23400,
      verified: true,
    },
    {
      id: "3",
      name: "Columbia Athletics",
      slug: "columbia-athletics",
      description: "Sports teams and athletic events",
      avatar: "CA",
      members: 412,
      activeMarkets: 8,
      totalVolume: 67800,
      verified: true,
    },
    {
      id: "4",
      name: "Columbia Engineering",
      slug: "columbia-engineering",
      description: "Engineering department academic predictions",
      avatar: "CE",
      members: 301,
      activeMarkets: 15,
      totalVolume: 52100,
      verified: true,
    },
    {
      id: "5",
      name: "Columbia Campus Life",
      slug: "columbia-campus-life",
      description: "Campus events, housing, and student life",
      avatar: "CL",
      members: 567,
      activeMarkets: 9,
      totalVolume: 34200,
      verified: false,
    },
    {
      id: "6",
      name: "Columbia Business School",
      slug: "columbia-business",
      description: "Business school events and market predictions",
      avatar: "CB",
      members: 156,
      activeMarkets: 6,
      totalVolume: 28900,
      verified: true,
    },
  ];

  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden animated-gradient border-b border-border/50">
        <div className="container mx-auto px-6 py-8 md:py-10">
          <div className="max-w-3xl mx-auto text-center space-y-3 fade-in">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tighter">Communities</h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Join communities and create prediction markets
            </p>
            <div className="pt-2">
              <Link href="/communities/create">
                <Button className="shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">

        {/* Search */}
        <div className="mb-10">
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 shadow-sm text-base"
            />
          </div>
        </div>

        {/* Communities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <Link key={community.id} href={`/communities/${community.slug}`} className="group">
              <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-border/50 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                <div className="space-y-4">
                  {/* Avatar and Name */}
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="text-lg font-medium">
                        {community.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-lg group-hover:text-primary transition-colors truncate">
                          {community.name}
                        </h3>
                        {community.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {community.description}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                    <div className="space-y-1">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="h-3 w-3 mr-1" />
                        <span className="text-xs">Members</span>
                      </div>
                      <div className="font-medium">{community.members}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-muted-foreground">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span className="text-xs">Markets</span>
                      </div>
                      <div className="font-medium">{community.activeMarkets}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Volume</div>
                      <div className="font-medium">
                        ${(community.totalVolume / 1000).toFixed(1)}k
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredCommunities.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-6 text-base">No communities found</p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
