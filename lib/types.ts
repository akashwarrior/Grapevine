// Market types
export interface MarketOutcome {
  name: string;
  probability: number;
  pool: number;
  bets?: number;
}

export interface HistoricalDataPoint {
  timestamp: number;
  values: Record<string, number>; // outcome name -> probability
}

export interface Market {
  id: string;
  // Optional on-chain market address (when available)
  marketAddress?: string;
  title: string;
  description?: string;
  community: string;
  creator?: string;
  createdDate?: Date;
  endDate: Date;
  resolutionDate?: Date;
  totalPool: number;
  totalBets?: number;
  status?: "active" | "closed" | "resolved";
  outcomes: MarketOutcome[];
  resolutionSource?: string;
  historicalData?: HistoricalDataPoint[];
}