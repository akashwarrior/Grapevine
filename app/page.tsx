"use client"

import { MarketCard } from "@/components/markets/market-card";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { ALL_MARKETS } from "@/lib/constant";
import { Market } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Tier 1: Institutions/Main Communities
const institutions = [
  { id: "all", name: "All" },
  { id: "columbia", name: "Columbia" },
  { id: "nyu", name: "NYU" },
  { id: "nyc", name: "NYC Community" },
] as const;

// Tier 2: Sub-communities per institution
const subCommunities: Record<string, Array<{ id: string; name: string }>> = {
  all: [
    { id: "for-you", name: "For you" },
    { id: "trending", name: "Trending" },
    { id: "new", name: "New" },
    { id: "ending-soon", name: "Ending Soon" },
  ],
  columbia: [
    { id: "for-you", name: "For you" },
    { id: "cs", name: "CS" },
    { id: "athletics", name: "Athletics" },
    { id: "engineering", name: "Engineering" },
    { id: "campus-life", name: "Campus Life" },
    { id: "governance", name: "Student Government" },
    { id: "greek-life", name: "Greek Life" },
    { id: "housing", name: "Housing" },
    { id: "dining", name: "Dining" },
    { id: "events", name: "Events" },
    { id: "academics", name: "Academics" },
  ],
  nyu: [
    { id: "for-you", name: "For you" },
    { id: "stern", name: "Stern Business" },
    { id: "tisch", name: "Tisch Arts" },
    { id: "cas", name: "CAS" },
    { id: "athletics", name: "Athletics" },
    { id: "campus-life", name: "Campus Life" },
    { id: "housing", name: "Housing" },
  ],
  nyc: [
    { id: "for-you", name: "For you" },
    { id: "events", name: "Events" },
    { id: "weather", name: "Weather" },
    { id: "transit", name: "Transit" },
    { id: "sports", name: "Sports" },
    { id: "politics", name: "Politics" },
  ],
} as const;

export default function Home() {
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all");

  const currentSubCommunities = subCommunities[selectedInstitution];

  const filteredMarkets = () => {
    const sarah = ALL_MARKETS.find((m) =>
      m.title.toLowerCase().includes("sarah chen")
    );
    const hardcodedRest = ALL_MARKETS.filter(
      (m) => !m.title.toLowerCase().includes("sarah chen")
    );

    const ordered: Market[] = [];
    if (sarah) ordered.push(sarah);
    ordered.push(...hardcodedRest);
    return ordered;
  }

  return (
    <div className="container mx-auto px-6 py-6">
      <div className="mb-8 space-y-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide border-b border-border/30">
          <AnimatedBackground
            defaultValue={selectedInstitution}
            className='mt-auto mx-auto left-0 right-0 h-0.5 w-[calc(100%-16px)] bg-primary rounded-full'
            onValueChange={setSelectedInstitution}
          >
            {institutions.map((institution) => (
              <button
                key={institution.id}
                data-id={institution.id}
                className={cn("pb-3 px-4 text-[13px] font-medium transition-colors whitespace-nowrap relative",
                  selectedInstitution === institution.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {institution.name}
              </button>
            ))}
          </AnimatedBackground>
        </div>

        <div className="relative flex gap-3 items-center overflow-x-auto">
          <AnimatedBackground
            defaultValue={currentSubCommunities[0].id}
            className='h-full rounded-full bg-primary inset-shadow-primary inset-shadow-sm'
          >
            {currentSubCommunities.map((subCommunity) => (
              <button
                key={subCommunity.id}
                data-id={subCommunity.id}
                className="px-4 py-2 text-[13px] font-medium transition-colors duration-200 whitespace-nowrap not-data-checked:text-muted-foreground not-data-checked:hover:text-foreground data-checked:text-primary-foreground"
              >
                {subCommunity.name}
              </button>
            ))}
          </AnimatedBackground>
        </div>
      </div>


      {/* Featured/Most Popular Market - Hero Card */}
      {filteredMarkets().length > 0 && (
        <div className="mb-8">
          <MarketCard market={filteredMarkets()[0]} featured />
        </div>
      )}

      {/* Markets Grid - 4 columns */}
      {false ? (
        <div className="text-center py-10 text-muted-foreground">
          Loading markets...
        </div>
      ) : filteredMarkets().length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredMarkets().slice(1).map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          No markets found
        </div>
      )}
    </div>
  );
}
