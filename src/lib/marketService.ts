import { contractService } from './contractService';

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

// Market type mappings
const MARKET_TYPE_NAMES = {
  0: "weather",
  1: "crop", 
  2: "price",
  3: "trade",
  4: "policy"
} as const;

const MARKET_STATUS_NAMES = {
  0: "Open",
  1: "Resolving", 
  2: "Closed",
  3: "Cancelled"
} as const;

const ORACLE_TYPE_NAMES = {
  0: "Manual",
  1: "Chainlink",
  2: "SAWS API"
} as const;

export class MarketService {
  private static instance: MarketService;
  private marketsCache: Market[] = [];
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 30000; // 30 seconds

  public static getInstance(): MarketService {
    if (!MarketService.instance) {
      MarketService.instance = new MarketService();
    }
    return MarketService.instance;
  }

  /**
   * Fetch all markets from the blockchain
   */
  public async getAllMarkets(): Promise<Market[]> {
    // Check if we have recent cached data
    const now = Date.now();
    if (this.marketsCache.length > 0 && (now - this.lastFetchTime) < this.CACHE_DURATION) {
      return this.marketsCache;
    }

    try {
      // Get total number of markets
      const totalMarketsResult = await contractService.getTotalMarkets();
      if (!totalMarketsResult.success || !totalMarketsResult.count) {
        console.warn('No markets found or error fetching total markets');
        return [];
      }

      const totalMarkets = totalMarketsResult.count;
      const markets: Market[] = [];

      // Fetch each market
      for (let i = 1; i <= totalMarkets; i++) {
        try {
          const marketResult = await contractService.getMarket(i);
          if (marketResult.success && marketResult.market) {
            const blockchainMarket = marketResult.market;
            
            // Get market stakes
            const stakesResult = await contractService.getMarketStakes(i);
            const stakes = stakesResult.success ? stakesResult.stakes : {
              totalStaked: "0",
              yesStake: "0", 
              noStake: "0",
              participantCount: 0
            };

            // Convert blockchain data to our Market interface
            const market: Market = {
              id: blockchainMarket.id,
              title: blockchainMarket.title,
              description: blockchainMarket.description,
              type: MARKET_TYPE_NAMES[blockchainMarket.marketType as keyof typeof MARKET_TYPE_NAMES] || "weather",
              totalStaked: `R${parseFloat(stakes.totalStaked).toLocaleString()}`,
              yesPercentage: this.calculatePercentage(parseFloat(stakes.yesStake), parseFloat(stakes.totalStaked)),
              noPercentage: this.calculatePercentage(parseFloat(stakes.noStake), parseFloat(stakes.totalStaked)),
              timeLeft: this.calculateTimeLeft(blockchainMarket.endTime),
              participants: stakes.participantCount,
              region: blockchainMarket.region,
              yesOdds: this.calculateOdds(parseFloat(stakes.yesStake), parseFloat(stakes.totalStaked)),
              noOdds: this.calculateOdds(parseFloat(stakes.noStake), parseFloat(stakes.totalStaked)),
              status: MARKET_STATUS_NAMES[blockchainMarket.status as keyof typeof MARKET_STATUS_NAMES] || "Open",
              resolutionSource: ORACLE_TYPE_NAMES[blockchainMarket.oracleType as keyof typeof ORACLE_TYPE_NAMES] || "Manual",
              createdAt: new Date(blockchainMarket.createdAt * 1000).toISOString().split('T')[0],
              endDate: new Date(blockchainMarket.endTime * 1000).toISOString().split('T')[0],
              yesStake: `R${parseFloat(stakes.yesStake).toLocaleString()}`,
              noStake: `R${parseFloat(stakes.noStake).toLocaleString()}`
            };

            markets.push(market);
          }
        } catch (error) {
          console.warn(`Error fetching market ${i}:`, error);
          // Continue with other markets
        }
      }

      // Update cache
      this.marketsCache = markets;
      this.lastFetchTime = now;

      return markets;
    } catch (error) {
      console.error('Error fetching markets from blockchain:', error);
      // Return cached data if available, otherwise empty array
      return this.marketsCache;
    }
  }

  /**
   * Get a specific market by ID
   */
  public async getMarketById(id: number): Promise<Market | undefined> {
    const markets = await this.getAllMarkets();
    return markets.find(market => market.id === id);
  }

  /**
   * Get markets by status
   */
  public async getMarketsByStatus(status: Market['status']): Promise<Market[]> {
    const markets = await this.getAllMarkets();
    return markets.filter(market => market.status === status);
  }

  /**
   * Get markets by type
   */
  public async getMarketsByType(type: Market['type']): Promise<Market[]> {
    const markets = await this.getAllMarkets();
    return markets.filter(market => market.type === type);
  }

  /**
   * Get markets by region
   */
  public async getMarketsByRegion(region: string): Promise<Market[]> {
    const markets = await this.getAllMarkets();
    return markets.filter(market => market.region === region);
  }

  /**
   * Get dashboard statistics
   */
  public async getDashboardStats() {
    const markets = await this.getAllMarkets();
    
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
  }

  /**
   * Clear cache to force fresh data fetch
   */
  public clearCache(): void {
    this.marketsCache = [];
    this.lastFetchTime = 0;
  }

  // Helper methods
  private calculatePercentage(amount: number, total: number): number {
    if (total === 0) return 50;
    return Math.round((amount / total) * 100);
  }

  private calculateOdds(amount: number, total: number): number {
    if (amount === 0) return 2.0;
    return Math.round((total / amount) * 100) / 100;
  }

  private calculateTimeLeft(endTime: number): string {
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) return "Expired";
    
    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} left`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} left`;
    } else {
      return "Less than 1 hour left";
    }
  }
}

// Export singleton instance
export const marketService = MarketService.getInstance();
