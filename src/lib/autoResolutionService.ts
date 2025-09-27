import { contractService } from './contractService';
import { marketService } from './marketService';

export interface AutoResolutionConfig {
  enabled: boolean;
  checkInterval: number; // in milliseconds
  autoResolveOnExpiry: boolean;
  defaultOutcome: 'yes' | 'no' | 'cancel';
}

export class AutoResolutionService {
  private static instance: AutoResolutionService;
  private intervalId: NodeJS.Timeout | null = null;
  private config: AutoResolutionConfig = {
    enabled: true,
    checkInterval: 60000, // Check every minute
    autoResolveOnExpiry: true,
    defaultOutcome: 'cancel' // Default to cancel if no clear outcome
  };

  public static getInstance(): AutoResolutionService {
    if (!AutoResolutionService.instance) {
      AutoResolutionService.instance = new AutoResolutionService();
    }
    return AutoResolutionService.instance;
  }

  /**
   * Start the automatic resolution service
   */
  public start(): void {
    if (this.intervalId) {
      console.log('Auto-resolution service already running');
      return;
    }

    console.log('Starting auto-resolution service...');
    this.intervalId = setInterval(() => {
      this.checkAndResolveExpiredMarkets();
    }, this.config.checkInterval);
  }

  /**
   * Stop the automatic resolution service
   */
  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Auto-resolution service stopped');
    }
  }

  /**
   * Check for expired markets and resolve them
   */
  private async checkAndResolveExpiredMarkets(): Promise<void> {
    if (!this.config.enabled) return;

    try {
      console.log('Checking for expired markets...');
      
      // Get all markets from blockchain
      const markets = await marketService.getAllMarkets();
      const now = Math.floor(Date.now() / 1000);

      for (const market of markets) {
        // Check if market is expired and not already resolved
        if (this.isMarketExpired(market, now) && market.status === 'Open') {
          console.log(`Market ${market.id} has expired, attempting resolution...`);
          await this.resolveExpiredMarket(market);
        }
      }
    } catch (error) {
      console.error('Error in auto-resolution check:', error);
    }
  }

  /**
   * Check if a market has expired
   */
  private isMarketExpired(market: any, currentTime: number): boolean {
    // Parse the end date and convert to timestamp
    const endDate = new Date(market.endDate);
    const endTime = Math.floor(endDate.getTime() / 1000);
    
    return currentTime >= endTime;
  }

  /**
   * Resolve an expired market
   */
  private async resolveExpiredMarket(market: any): Promise<void> {
    try {
      // Determine the outcome based on the market type and current stakes
      const outcome = await this.determineMarketOutcome(market);
      
      if (outcome === 'cancel') {
        console.log(`Market ${market.id} will be cancelled (no clear outcome)`);
        // For now, we'll resolve as 'no' since we don't have a cancel function
        // In a real implementation, you might want to add a cancel function to the contract
        await this.resolveMarket(market.id, false);
      } else {
        console.log(`Market ${market.id} resolved as: ${outcome}`);
        await this.resolveMarket(market.id, outcome === 'yes');
      }
    } catch (error) {
      console.error(`Error resolving market ${market.id}:`, error);
    }
  }

  /**
   * Determine the outcome of an expired market
   */
  private async determineMarketOutcome(market: any): Promise<'yes' | 'no' | 'cancel'> {
    // For now, we'll use a simple heuristic based on stake distribution
    // In a real implementation, you would integrate with external oracles
    
    const yesPercentage = market.yesPercentage;
    const noPercentage = market.noPercentage;
    
    // If there's a clear majority (60%+), use that as the outcome
    if (yesPercentage >= 60) {
      return 'yes';
    } else if (noPercentage >= 60) {
      return 'no';
    }
    
    // For weather markets, you might want to check actual weather data
    if (market.type === 'weather') {
      return await this.getWeatherOutcome(market);
    }
    
    // For crop markets, you might want to check harvest data
    if (market.type === 'crop') {
      return await this.getCropOutcome(market);
    }
    
    // Default to cancel if no clear outcome
    return 'cancel';
  }

  /**
   * Get weather-based outcome (placeholder for real weather API integration)
   */
  private async getWeatherOutcome(market: any): Promise<'yes' | 'no' | 'cancel'> {
    // This is a placeholder - in a real implementation, you would:
    // 1. Parse the market title to extract the weather condition
    // 2. Query a weather API (like OpenWeatherMap, WeatherAPI, etc.)
    // 3. Compare the actual weather data with the market condition
    // 4. Return the appropriate outcome
    
    console.log(`Checking weather outcome for market: ${market.title}`);
    
    // For now, return a random outcome for demonstration
    // In production, replace this with actual weather data
    return Math.random() > 0.5 ? 'yes' : 'no';
  }

  /**
   * Get crop-based outcome (placeholder for real crop data integration)
   */
  private async getCropOutcome(market: any): Promise<'yes' | 'no' | 'cancel'> {
    // This is a placeholder - in a real implementation, you would:
    // 1. Parse the market title to extract the crop condition
    // 2. Query agricultural data APIs
    // 3. Compare actual harvest data with the market condition
    // 4. Return the appropriate outcome
    
    console.log(`Checking crop outcome for market: ${market.title}`);
    
    // For now, return a random outcome for demonstration
    // In production, replace this with actual crop data
    return Math.random() > 0.5 ? 'yes' : 'no';
  }

  /**
   * Resolve a market with the given outcome
   */
  private async resolveMarket(marketId: number, outcome: boolean): Promise<void> {
    try {
      const result = await contractService.resolveMarket(marketId, outcome);
      
      if (result.success) {
        console.log(`Market ${marketId} resolved successfully with outcome: ${outcome ? 'Yes' : 'No'}`);
        // Clear cache to refresh data
        marketService.clearCache();
      } else {
        console.error(`Failed to resolve market ${marketId}:`, result.error);
      }
    } catch (error) {
      console.error(`Error resolving market ${marketId}:`, error);
    }
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<AutoResolutionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('Auto-resolution config updated:', this.config);
  }

  /**
   * Get current configuration
   */
  public getConfig(): AutoResolutionConfig {
    return { ...this.config };
  }

  /**
   * Manually trigger a resolution check
   */
  public async triggerCheck(): Promise<void> {
    await this.checkAndResolveExpiredMarkets();
  }
}

// Export singleton instance
export const autoResolutionService = AutoResolutionService.getInstance();
