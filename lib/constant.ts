import { Market } from "./types";
import { generateHistoricalData } from "./utils/generate-historical-data";

/**
 * Extended mock market data for markets page
 * TODO: Replace with actual API data fetching
 */
const marketsWithoutHistory: Omit<Market, "historicalData">[] = [
  {
    id: "2",
    title: "Will Sarah Chen win Student Council President?",
    community: "Columbia Governance",
    endDate: new Date("2025-11-20"),
    totalPool: 8500,
    totalBets: 187,
    outcomes: [
      { name: "Yes", probability: 45, pool: 3825 },
      { name: "No", probability: 55, pool: 4675 },
    ],
  },
  {
    id: "1",
    title: "Will the CS Final Exam average be above 85%?",
    community: "Columbia CS",
    endDate: new Date("2025-12-15"),
    totalPool: 1250,
    totalBets: 47,
    outcomes: [
      { name: "Yes", probability: 65, pool: 812 },
      { name: "No", probability: 35, pool: 438 },
    ],
  },
  {
    id: "3",
    title: "Will the Basketball Team make playoffs?",
    community: "Columbia Athletics",
    endDate: new Date("2025-12-01"),
    totalPool: 890,
    totalBets: 34,
    outcomes: [
      { name: "Yes", probability: 72, pool: 640 },
      { name: "No", probability: 28, pool: 250 },
    ],
  },
  {
    id: "4",
    title: "Will Project X deadline be extended?",
    community: "Columbia CS",
    endDate: new Date("2025-11-15"),
    totalPool: 420,
    totalBets: 23,
    outcomes: [
      { name: "Yes", probability: 80, pool: 336 },
      { name: "No", probability: 20, pool: 84 },
    ],
  },
  {
    id: "5",
    title: "Will next semester's average GPA be above 3.5?",
    community: "Columbia Engineering",
    endDate: new Date("2026-01-20"),
    totalPool: 2100,
    totalBets: 67,
    outcomes: [
      { name: "Yes", probability: 35, pool: 735 },
      { name: "No", probability: 65, pool: 1365 },
    ],
  },
  {
    id: "6",
    title: "Will the Library add 24/7 hours during finals?",
    community: "Columbia Campus Life",
    endDate: new Date("2025-12-01"),
    totalPool: 670,
    totalBets: 42,
    outcomes: [
      { name: "Yes", probability: 55, pool: 368 },
      { name: "No", probability: 45, pool: 302 },
    ],
  },
  {
    id: "7",
    title: "Will tuition increase by more than 5% next year?",
    community: "Columbia Governance",
    endDate: new Date("2025-11-30"),
    totalPool: 5200,
    totalBets: 134,
    outcomes: [
      { name: "Yes", probability: 68, pool: 3536 },
      { name: "No", probability: 32, pool: 1664 },
    ],
  },
  {
    id: "8",
    title: "Will spring concert feature a major artist?",
    community: "Columbia Campus Life",
    endDate: new Date("2026-02-01"),
    totalPool: 1850,
    totalBets: 76,
    outcomes: [
      { name: "Yes", probability: 42, pool: 777 },
      { name: "No", probability: 58, pool: 1073 },
    ],
  },
  {
    id: "9",
    title: "Football vs Yale: Will Columbia win?",
    community: "Columbia Athletics",
    endDate: new Date("2025-11-16"),
    totalPool: 2450,
    totalBets: 98,
    outcomes: [
      { name: "Yes", probability: 38, pool: 931 },
      { name: "No", probability: 62, pool: 1519 },
    ],
  },
  {
    id: "10",
    title: "Will AI course enrollment exceed 500 students?",
    community: "Columbia CS",
    endDate: new Date("2026-01-10"),
    totalPool: 980,
    totalBets: 41,
    outcomes: [
      { name: "Yes", probability: 75, pool: 735 },
      { name: "No", probability: 25, pool: 245 },
    ],
  },
  {
    id: "11",
    title: "Campus sustainability initiative result",
    community: "Columbia Governance",
    endDate: new Date("2025-12-20"),
    totalPool: 1560,
    totalBets: 63,
    outcomes: [
      { name: "Passes", probability: 62, pool: 967 },
      { name: "Fails", probability: 38, pool: 593 },
    ],
  },
  {
    id: "12",
    title: "Will new dining hall open on schedule?",
    community: "Columbia Campus Life",
    endDate: new Date("2026-03-01"),
    totalPool: 720,
    totalBets: 29,
    outcomes: [
      { name: "Yes", probability: 35, pool: 252 },
      { name: "No", probability: 65, pool: 468 },
    ],
  },
  {
    id: "13",
    title: "Women's Soccer NCAA Tournament prediction",
    community: "Columbia Athletics",
    endDate: new Date("2025-11-25"),
    totalPool: 1340,
    totalBets: 55,
    outcomes: [
      { name: "Make it", probability: 58, pool: 777 },
      { name: "Miss it", probability: 42, pool: 563 },
    ],
  },
  {
    id: "14",
    title: "Will Physics department hire 3+ new professors?",
    community: "Columbia Engineering",
    endDate: new Date("2026-02-15"),
    totalPool: 890,
    totalBets: 37,
    outcomes: [
      { name: "Yes", probability: 48, pool: 427 },
      { name: "No", probability: 52, pool: 463 },
    ],
  },
  {
    id: "15",
    title: "Will Hackathon have over 300 participants?",
    community: "Columbia CS",
    endDate: new Date("2025-11-30"),
    totalPool: 1120,
    totalBets: 48,
    outcomes: [
      { name: "Yes", probability: 44, pool: 493 },
      { name: "No", probability: 56, pool: 627 },
    ],
  },
  {
    id: "16",
    title: "Will winter break start early this year?",
    community: "Columbia Governance",
    endDate: new Date("2025-11-15"),
    totalPool: 2890,
    totalBets: 112,
    outcomes: [
      { name: "Yes", probability: 23, pool: 665 },
      { name: "No", probability: 77, pool: 2225 },
    ],
  },
  {
    id: "17",
    title: "Will swimming team place in top 3 at championship?",
    community: "Columbia Athletics",
    endDate: new Date("2025-12-10"),
    totalPool: 670,
    totalBets: 28,
    outcomes: [
      { name: "Yes", probability: 52, pool: 348 },
      { name: "No", probability: 48, pool: 322 },
    ],
  },
  {
    id: "18",
    title: "Will remote learning option continue next semester?",
    community: "Columbia Campus Life",
    endDate: new Date("2025-12-15"),
    totalPool: 1780,
    totalBets: 71,
    outcomes: [
      { name: "Yes", probability: 67, pool: 1193 },
      { name: "No", probability: 33, pool: 587 },
    ],
  },
  {
    id: "19",
    title: "Will Engineering school rank in US News top 10?",
    community: "Columbia Engineering",
    endDate: new Date("2026-03-15"),
    totalPool: 3250,
    totalBets: 95,
    outcomes: [
      { name: "Yes", probability: 71, pool: 2308 },
      { name: "No", probability: 29, pool: 942 },
    ],
  },
  {
    id: "20",
    title: "Will CS capstone demo day be in-person?",
    community: "Columbia CS",
    endDate: new Date("2025-12-05"),
    totalPool: 540,
    totalBets: 31,
    outcomes: [
      { name: "Yes", probability: 82, pool: 443 },
      { name: "No", probability: 18, pool: 97 },
    ],
  },
];

// Add historical data to each market
export const ALL_MARKETS: Market[] = marketsWithoutHistory.map((market) => ({
  ...market,
  historicalData: generateHistoricalData(market.outcomes, 90, market.id), // 90 days of history
}));

