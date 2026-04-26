import { Clock } from "lucide-react";

interface MarketMetadataProps {
  community: string;
  timeRemaining: string;
}

export function MarketMetadata({ community, timeRemaining }: MarketMetadataProps) {
  return (
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span>{community}</span>
      <div className="flex items-center">
        <Clock className="h-3 w-3 mr-1" />
        <span>{timeRemaining}</span>
      </div>
    </div>
  );
}


