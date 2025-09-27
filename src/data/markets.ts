// Unified market data for the entire application
export interface Market {
  id: number;
  title: string;
  description: string;
  type: "weather" | "crop" | "price" | "trade" | "policy";
  totalStaked: string;
  yesPercentage: number;
  noPercentage: number;
  timeLeft: string;
  participants: number;
  region: string;
  yesOdds: number;
  noOdds: number;
  status: "Open" | "Resolving" | "Closed";
  resolutionSource: string;
  createdAt: string;
  endDate: string;
  yesStake: string;
  noStake: string;
}

// Comprehensive test market data
export const markets: Market[] = [
  {
    id: 1,
    title: "Rainfall > 30mm Limpopo Province",
    description: "Will Limpopo province receive more than 30mm of rainfall in the next 7 days? This market helps farmers hedge against weather risk and plan irrigation schedules.",
    type: "weather",
    totalStaked: "R2,450,000",
    yesPercentage: 69,
    noPercentage: 31,
    timeLeft: "3 days left",
    participants: 1247,
    region: "Limpopo",
    yesOdds: 1.46,
    noOdds: 3.18,
    status: "Open",
    resolutionSource: "South African Weather Service",
    createdAt: "2024-01-15",
    endDate: "2024-01-22",
    yesStake: "R1,680,000",
    noStake: "R770,000"
  },
  {
    id: 2,
    title: "Drought declaration Eastern Cape",
    description: "Will the Eastern Cape government declare a drought emergency in the next 30 days? This affects water allocation and agricultural support programs.",
    type: "weather",
    totalStaked: "R3,200,000",
    yesPercentage: 66,
    noPercentage: 34,
    timeLeft: "21 days left",
    participants: 2156,
    region: "Eastern Cape",
    yesOdds: 1.52,
    noOdds: 2.91,
    status: "Open",
    resolutionSource: "Eastern Cape Provincial Government",
    createdAt: "2024-01-10",
    endDate: "2024-02-10",
    yesStake: "R2,100,000",
    noStake: "R1,100,000"
  },
  {
    id: 3,
    title: "Maize yield > 5t/ha KwaZulu-Natal",
    description: "Will the average maize yield in KwaZulu-Natal exceed 5 tons per hectare this season? Based on current planting conditions and weather forecasts.",
    type: "crop",
    totalStaked: "R1,850,000",
    yesPercentage: 65,
    noPercentage: 35,
    timeLeft: "14 days left",
    participants: 892,
    region: "KwaZulu-Natal",
    yesOdds: 1.54,
    noOdds: 2.85,
    status: "Resolving",
    resolutionSource: "Department of Agriculture",
    createdAt: "2024-01-05",
    endDate: "2024-02-05",
    yesStake: "R1,200,000",
    noStake: "R650,000"
  },
  {
    id: 4,
    title: "Frost warning Western Cape",
    description: "Will Western Cape experience severe frost conditions affecting crops this winter? Critical for wine grape and fruit production.",
    type: "weather",
    totalStaked: "R950,000",
    yesPercentage: 40,
    noPercentage: 60,
    timeLeft: "Expired",
    participants: 456,
    region: "Western Cape",
    yesOdds: 2.50,
    noOdds: 1.67,
    status: "Closed",
    resolutionSource: "South African Weather Service",
    createdAt: "2024-01-01",
    endDate: "2024-01-15",
    yesStake: "R380,000",
    noStake: "R570,000"
  },
  {
    id: 5,
    title: "Wheat price > R4,500/ton",
    description: "Will the average wheat price exceed R4,500 per ton by end of harvest season? Based on global markets and local supply conditions.",
    type: "price",
    totalStaked: "R4,100,000",
    yesPercentage: 68,
    noPercentage: 32,
    timeLeft: "45 days left",
    participants: 1834,
    region: "National",
    yesOdds: 1.46,
    noOdds: 3.15,
    status: "Open",
    resolutionSource: "South African Grain Information Service",
    createdAt: "2024-01-12",
    endDate: "2024-03-12",
    yesStake: "R2,800,000",
    noStake: "R1,300,000"
  },
  {
    id: 6,
    title: "Soybean export > 500k tons",
    description: "Will South Africa export more than 500,000 tons of soybeans this year? Based on current production forecasts and international demand.",
    type: "trade",
    totalStaked: "R2,750,000",
    yesPercentage: 60,
    noPercentage: 40,
    timeLeft: "78 days left",
    participants: 1123,
    region: "National",
    yesOdds: 1.67,
    noOdds: 2.50,
    status: "Open",
    resolutionSource: "South African Revenue Service",
    createdAt: "2024-01-08",
    endDate: "2024-04-08",
    yesStake: "R1,650,000",
    noStake: "R1,100,000"
  },
  {
    id: 7,
    title: "Sugar cane yield < 60t/ha",
    description: "Will the average sugar cane yield fall below 60 tons per hectare this season? Based on current weather patterns and soil conditions.",
    type: "crop",
    totalStaked: "R1,600,000",
    yesPercentage: 56,
    noPercentage: 44,
    timeLeft: "28 days left",
    participants: 678,
    region: "KwaZulu-Natal",
    yesOdds: 1.78,
    noOdds: 2.29,
    status: "Resolving",
    resolutionSource: "South African Sugar Association",
    createdAt: "2024-01-03",
    endDate: "2024-02-03",
    yesStake: "R900,000",
    noStake: "R700,000"
  },
  {
    id: 8,
    title: "Livestock feed price increase > 15%",
    description: "Will livestock feed prices increase by more than 15% compared to last year? Based on grain prices and production costs.",
    type: "price",
    totalStaked: "R3,500,000",
    yesPercentage: 60,
    noPercentage: 40,
    timeLeft: "92 days left",
    participants: 1456,
    region: "National",
    yesOdds: 1.67,
    noOdds: 2.50,
    status: "Open",
    resolutionSource: "National Agricultural Marketing Council",
    createdAt: "2024-01-14",
    endDate: "2024-04-14",
    yesStake: "R2,100,000",
    noStake: "R1,400,000"
  },
  {
    id: 9,
    title: "Sunflower harvest success - Free State",
    description: "Will Free State sunflower farmers achieve above-average harvest yields this season? Based on rainfall patterns and soil moisture levels.",
    type: "crop",
    totalStaked: "R1,200,000",
    yesPercentage: 42,
    noPercentage: 58,
    timeLeft: "35 days left",
    participants: 534,
    region: "Free State",
    yesOdds: 2.38,
    noOdds: 1.72,
    status: "Open",
    resolutionSource: "Free State Department of Agriculture",
    createdAt: "2024-01-07",
    endDate: "2024-02-07",
    yesStake: "R504,000",
    noStake: "R696,000"
  },
  {
    id: 10,
    title: "Temperature exceeds 35°C for 5 consecutive days",
    description: "Will the Northern Cape experience 5+ consecutive days above 35°C this month? Based on current weather forecasts and historical patterns.",
    type: "weather",
    totalStaked: "R800,000",
    yesPercentage: 85,
    noPercentage: 15,
    timeLeft: "12 days left",
    participants: 423,
    region: "Northern Cape",
    yesOdds: 1.18,
    noOdds: 6.67,
    status: "Open",
    resolutionSource: "South African Weather Service",
    createdAt: "2024-01-11",
    endDate: "2024-01-25",
    yesStake: "R680,000",
    noStake: "R120,000"
  },
  {
    id: 11,
    title: "Wheat quality grade - Western Cape",
    description: "Will Western Cape wheat achieve premium grade classification this harvest? Based on protein content and moisture levels.",
    type: "crop",
    totalStaked: "R1,100,000",
    yesPercentage: 55,
    noPercentage: 45,
    timeLeft: "62 days left",
    participants: 567,
    region: "Western Cape",
    yesOdds: 1.82,
    noOdds: 2.22,
    status: "Open",
    resolutionSource: "South African Grain Laboratory",
    createdAt: "2024-01-09",
    endDate: "2024-03-09",
    yesStake: "R605,000",
    noStake: "R495,000"
  },
  {
    id: 12,
    title: "Agricultural subsidy increase",
    description: "Will the government announce increased agricultural subsidies in the next budget? Based on current policy discussions and economic conditions.",
    type: "policy",
    totalStaked: "R2,300,000",
    yesPercentage: 35,
    noPercentage: 65,
    timeLeft: "120 days left",
    participants: 789,
    region: "National",
    yesOdds: 2.86,
    noOdds: 1.54,
    status: "Open",
    resolutionSource: "National Treasury",
    createdAt: "2024-01-13",
    endDate: "2024-05-13",
    yesStake: "R805,000",
    noStake: "R1,495,000"
  }
];

// Helper functions
export const getMarketById = (id: number): Market | undefined => {
  return markets.find(market => market.id === id);
};

export const getMarketsByStatus = (status: Market['status']): Market[] => {
  return markets.filter(market => market.status === status);
};

export const getMarketsByType = (type: Market['type']): Market[] => {
  return markets.filter(market => market.type === type);
};

export const getMarketsByRegion = (region: string): Market[] => {
  return markets.filter(market => market.region === region);
};

// Dashboard statistics calculated from market data
export const getDashboardStats = () => {
  const totalStaked = markets.reduce((sum, market) => {
    const amount = parseFloat(market.totalStaked.replace(/[R,]/g, ''));
    return sum + amount;
  }, 0);

  const totalParticipants = markets.reduce((sum, market) => sum + market.participants, 0);
  
  const openMarkets = markets.filter(m => m.status === "Open").length;
  const resolvingMarkets = markets.filter(m => m.status === "Resolving").length;
  const closedMarkets = markets.filter(m => m.status === "Closed").length;

  return {
    totalStaked: `R${(totalStaked / 1000000).toFixed(1)}M`,
    totalParticipants: totalParticipants.toLocaleString(),
    activeMarkets: markets.length,
    openMarkets,
    resolvingMarkets,
    closedMarkets
  };
};
