import { HistoricalDataPoint, MarketOutcome } from "@/lib/types";

interface TradeMetadata {
  id: string;
  market_id: string;
  trader: string;
  tx_hash: string;
  outcome: string;
  collateral_in: number;
  tokens_out: number;
  token_symbol: string;
  created_at: string;
}

/**
 * Deterministic pseudo-random number generator
 * This ensures the same data is generated on server and client
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Generate realistic historical probability data for market outcomes
 * Simulates realistic prediction market dynamics:
 * - Gradual drift with occasional sharp moves on "news events"
 * - Mean reversion tendencies
 * - Momentum effects
 * - Inverse correlation for binary markets (Yes/No always sum to 100)
 */
export function generateHistoricalData(
  outcomes: MarketOutcome[],
  daysOfHistory: number = 90,
  marketId: string = "default"
): HistoricalDataPoint[] {
  const dataPoints: HistoricalDataPoint[] = [];

  // Use a fixed timestamp base to ensure consistency
  const baseTimestamp = new Date("2024-10-01").getTime();
  const now = baseTimestamp + daysOfHistory * 24 * 60 * 60 * 1000;

  // Generate one data point per hour
  const hoursOfHistory = daysOfHistory * 24;

  // Create a seed from the marketId for deterministic randomness
  const marketSeed = marketId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // For binary markets, we only need to track the first outcome (Yes)
  // No is always 100 - Yes
  const isBinary = outcomes.length === 2;
  const currentYesProb = outcomes[0].probability;

  // Determine starting probability (somewhere between 25-75, with bias toward current)
  const startSeed = marketSeed * 17;
  let yesProb = 25 + seededRandom(startSeed) * 50; // Start between 25-75

  // Track momentum for realistic market dynamics
  let momentum = 0;

  // Schedule some "news events" that cause sharp moves
  const eventHours: number[] = [];
  for (let e = 0; e < 6; e++) {
    const eventSeed = marketSeed + e * 500;
    const eventHour =
      Math.floor(seededRandom(eventSeed) * hoursOfHistory * 0.85) + 100;
    eventHours.push(eventHour);
  }
  eventHours.sort((a, b) => a - b);

  for (let i = 0; i < hoursOfHistory; i++) {
    const timestamp = now - (hoursOfHistory - i) * 60 * 60 * 1000;
    const progress = i / hoursOfHistory;

    // Base drift toward final value (stronger as we approach end)
    const targetDrift = (currentYesProb - yesProb) * (0.001 + progress * 0.003);

    // Random walk component
    const noiseSeed = marketSeed + i * 13;
    const noise = (seededRandom(noiseSeed) - 0.5) * 1.2;

    // Mean reversion (pull toward 50 if extreme)
    const meanReversion = (50 - yesProb) * 0.0008;

    // Check for news events - sharp moves
    let eventImpact = 0;
    for (const eventHour of eventHours) {
      if (i >= eventHour && i < eventHour + 8) {
        // During event: sharp move over ~8 hours
        const eventSeed = marketSeed + eventHour * 7;
        const eventDirection = seededRandom(eventSeed) > 0.5 ? 1 : -1;
        const eventMagnitude = 2 + seededRandom(eventSeed + 1) * 4; // 2-6% move per hour
        const eventProgress = (i - eventHour) / 8;
        // Sharp at start, tapering off
        eventImpact =
          eventDirection * eventMagnitude * (1 - eventProgress * 0.8);
      }
      // Post-event: slight correction
      if (i >= eventHour + 8 && i < eventHour + 24) {
        const eventSeed = marketSeed + eventHour * 7;
        const eventDirection = seededRandom(eventSeed) > 0.5 ? 1 : -1;
        // Small reversal
        eventImpact -= eventDirection * 0.2;
      }
    }

    // Update momentum with decay
    momentum = momentum * 0.92 + noise * 0.25;

    // Apply all forces
    yesProb += targetDrift + noise + meanReversion + momentum * 0.4 + eventImpact;

    // Clamp between 5 and 95
    yesProb = Math.max(5, Math.min(95, yesProb));

    // Build values object
    const values: Record<string, number> = {};

    if (isBinary) {
      // Binary market: Yes and No are inversely correlated
      values[outcomes[0].name] = Math.round(yesProb * 100) / 100;
      values[outcomes[1].name] = Math.round((100 - yesProb) * 100) / 100;
    } else {
      // Multi-outcome: distribute based on ratios
      outcomes.forEach((outcome, idx) => {
        const outcomeSeed = marketSeed + idx * 1000 + i * 7;
        const baseProb = outcome.probability;
        const variation = (seededRandom(outcomeSeed) - 0.5) * 10 * (1 - progress);
        values[outcome.name] = Math.max(5, baseProb + variation);
      });

      // Normalize to 100
      const total = Object.values(values).reduce((sum, val) => sum + val, 0);
      Object.keys(values).forEach((key) => {
        values[key] = Math.round((values[key] / total) * 10000) / 100;
      });
    }

    dataPoints.push({ timestamp, values });
  }

  return dataPoints;
}

/**
 * Filter historical data by time period
 */
export function filterHistoricalDataByPeriod(
  data: HistoricalDataPoint[],
  period: string
): HistoricalDataPoint[] {
  const now = Date.now();
  let cutoffTime: number;

  switch (period) {
    case "1H":
      cutoffTime = now - 60 * 60 * 1000;
      break;
    case "6H":
      cutoffTime = now - 6 * 60 * 60 * 1000;
      break;
    case "1D":
      cutoffTime = now - 24 * 60 * 60 * 1000;
      break;
    case "1W":
      cutoffTime = now - 7 * 24 * 60 * 60 * 1000;
      break;
    case "1M":
      cutoffTime = now - 30 * 24 * 60 * 60 * 1000;
      break;
    case "ALL":
    default:
      return data;
  }

  return data.filter((point) => point.timestamp >= cutoffTime);
}

export function generateHistoricalDataFromTrades(trades: TradeMetadata[], yesLabel: string, noLabel: string): HistoricalDataPoint[] {
  const points: HistoricalDataPoint[] = [];

  if (!yesLabel || !noLabel) return points;

  // 1) Initial point with 50 / 50
  if (trades.length === 0) {
    const now = Date.now();
    points.push({
      timestamp: now,
      values: {
        [yesLabel]: 50,
        [noLabel]: 50,
      },
    });
    return points;
  }

  // 2) Start with 50 / 50 at first trade timestamp
  const firstTs = new Date(trades[0].created_at).getTime();
  points.push({
    timestamp: firstTs,
    values: {
      [yesLabel]: 50,
      [noLabel]: 50,
    },
  });

  // Reserves in 18 decimal shares (matching contract)
  let reserveYes: bigint = 0n;
  let reserveNo: bigint = 0n;

  // Assume USDC with 6 decimals - adjust if different
  const COLLAT_DECIMALS = 6;
  const shareScale = 10n ** BigInt(18 - COLLAT_DECIMALS); // 10^12 for USDC

  let currentTime = trades[0].created_at;

  const flushPoint = () => {
    // If no reserves yet, keep 50/50
    if (reserveYes === 0n && reserveNo === 0n) {
      points.push({
        timestamp: new Date(currentTime).getTime(),
        values: {
          [yesLabel]: 50,
          [noLabel]: 50,
        },
      });
      return;
    }

    const total = reserveYes + reserveNo;
    if (total === 0n) {
      points.push({
        timestamp: new Date(currentTime).getTime(),
        values: {
          [yesLabel]: 50,
          [noLabel]: 50,
        },
      });
      return;
    }

    // Price of YES = reserveNo / total (more NO means YES is cheaper)
    const yesProb = Number((reserveNo * 10000n) / total) / 100;
    const noProb = 100 - yesProb;

    points.push({
      timestamp: new Date(currentTime).getTime(),
      values: {
        [yesLabel]: yesProb,
        [noLabel]: noProb,
      },
    });
  };

  for (const t of trades) {
    if (t.created_at !== currentTime) {
      flushPoint();
      currentTime = t.created_at;
    }

    // Reconstruct the trade mechanics from contract
    // collateral_in is in collateral decimals (e.g., USDC = 6 decimals)
    const collateralIn = BigInt(Math.floor(t.collateral_in * (10 ** COLLAT_DECIMALS)));

    // Assuming 1% fee (100 bps) - adjust to your actual tradeFeeBps
    const fee = (collateralIn * 100n) / 10000n;
    const net = collateralIn - fee;

    // Minted shares (18 decimals)
    const minted = net * shareScale;

    // Calculate swap output using CPMM formula
    let extraTokens = 0n;
    if (reserveYes > 0n && reserveNo > 0n) {
      if (t.outcome === yesLabel) {
        // Buying YES: sell NO into pool
        // out = minted * reserveYes / (reserveNo + minted)
        extraTokens = (minted * reserveYes) / (reserveNo + minted);
      } else if (t.outcome === noLabel) {
        // Buying NO: sell YES into pool
        // out = minted * reserveNo / (reserveYes + minted)
        extraTokens = (minted * reserveNo) / (reserveYes + minted);
      }
    }

    // Update reserves based on trade
    if (t.outcome === yesLabel) {
      // User buys YES: NO goes into pool, YES comes out
      reserveNo += minted;
      reserveYes -= extraTokens;
    } else if (t.outcome === noLabel) {
      // User buys NO: YES goes into pool, NO comes out
      reserveYes += minted;
      reserveNo -= extraTokens;
    }

    // Ensure reserves don't go negative (shouldn't happen with correct data)
    if (reserveYes < 0n) reserveYes = 0n;
    if (reserveNo < 0n) reserveNo = 0n;
  }

  // Flush last timestamp
  flushPoint();

  return points;
}
