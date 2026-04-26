
"use client";

import { MarketCard } from "@/components/markets/market-card";
import { Button } from "@/components/ui/button";
import { ALL_MARKETS } from "@/lib/constant";

/**
 * Markets page - displays all markets with filtering and sorting
 * Uses custom hook for memoized filtering logic
 * 
 * TODO: Convert to Server Component when API is ready
 * - Use searchParams for filters (shareable URLs)
 * - Fetch data server-side
 * - Extract filter UI to separate Client Component
 */
export default function MarketsPage() {
  const setSearchQuery = (query: string) => { void query; };
  const setCategoryFilter = (category: string) => { void category; };
  const filteredMarkets = ALL_MARKETS;

  const trendingTopics = [
    "For you",
    "Tesla Earnings",
    "NHL",
    "Pro Football",
    "Baseball Championship",
    "Pro Basketball",
    "Ukraine",
    "Taylor Swift",
    "Shutdown",
    "Epstein",
    "NYC Mayor",
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Trending Topics Pills */}
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          {trendingTopics.map((topic, index) => (
            <button
              key={topic}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${index === 0
                ? "bg-primary text-primary-foreground shadow-inner-primary hover:shadow-inner-primary-hover"
                : "bg-secondary text-foreground shadow-inner-chip hover:shadow-inner-chip-hover"
                }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Featured/Most Popular Market - Hero Card */}
      {filteredMarkets.length > 0 && (
        <div className="mb-6">
          <MarketCard market={filteredMarkets[0]} featured />
        </div>
      )}

      {/* Markets Grid - 4 columns */}
      {filteredMarkets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">No markets found matching your filters</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Load More */}
      <div className="mt-12 text-center">
        <Button variant="outline" size="lg">
          Load More Markets
        </Button>
      </div>
    </div>
  );
}
