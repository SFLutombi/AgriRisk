import { ethers } from 'ethers';
import { CONTRACT_CONFIG, MARKET_TYPES, ORACLE_TYPES } from './contractConfig';

// Contract service for interacting with AgriRisk contracts
export class ContractService {
  private marketFactory: ethers.Contract | null = null;
  private stakingContract: ethers.Contract | null = null;
  private resolutionContract: ethers.Contract | null = null;
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      await this.initializeContracts();
    }
  }

  private async initializeContracts() {
    if (!this.provider || !this.signer) return;

    try {
      const network = await this.provider.getNetwork();
      const networkAddresses = CONTRACT_CONFIG.addresses[network.chainId.toString() as keyof typeof CONTRACT_CONFIG.addresses];
      
      if (!networkAddresses || 
          networkAddresses.marketFactory === "0x0000000000000000000000000000000000000000" ||
          networkAddresses.staking === "0x0000000000000000000000000000000000000000" ||
          networkAddresses.resolution === "0x0000000000000000000000000000000000000000") {
        console.warn(`Contracts not deployed on network ${network.chainId}`);
        return;
      }

      this.marketFactory = new ethers.Contract(
        networkAddresses.marketFactory,
        CONTRACT_CONFIG.marketFactoryABI,
        this.signer
      );

      this.stakingContract = new ethers.Contract(
        networkAddresses.staking,
        CONTRACT_CONFIG.stakingABI,
        this.signer
      );

      this.resolutionContract = new ethers.Contract(
        networkAddresses.resolution,
        CONTRACT_CONFIG.resolutionABI,
        this.signer
      );
    } catch (error) {
      console.error('Failed to initialize contracts:', error);
    }
  }

  // Check if contracts are available
  public isContractAvailable(): boolean {
    return this.marketFactory !== null && this.stakingContract !== null && this.resolutionContract !== null;
  }

  // Get contract instances
  public getMarketFactory(): ethers.Contract | null {
    return this.marketFactory;
  }

  public getStakingContract(): ethers.Contract | null {
    return this.stakingContract;
  }

  public getResolutionContract(): ethers.Contract | null {
    return this.resolutionContract;
  }

  // Create a new market
  public async createMarket(marketData: {
    title: string;
    description: string;
    marketType: string;
    region: string;
    endTime: number;
    oracleType: string;
  }): Promise<{ success: boolean; marketId?: number; txHash?: string; error?: string }> {
    if (!this.marketFactory) {
      return { success: false, error: 'MarketFactory contract not available. Please check your network connection.' };
    }

    try {
      // Convert string types to enum values
      const marketTypeEnum = MARKET_TYPES[marketData.marketType as keyof typeof MARKET_TYPES];
      const oracleTypeEnum = ORACLE_TYPES[marketData.oracleType as keyof typeof ORACLE_TYPES];

      if (marketTypeEnum === undefined) {
        return { success: false, error: 'Invalid market type' };
      }

      if (oracleTypeEnum === undefined) {
        return { success: false, error: 'Invalid oracle type' };
      }

      // Call the createMarket function
      const tx = await this.marketFactory.createMarket(
        marketData.title,
        marketData.description,
        marketTypeEnum,
        marketData.region,
        marketData.endTime,
        oracleTypeEnum
      );

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Extract market ID from the event logs
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = this.marketFactory!.interface.parseLog(log);
          return parsed?.name === 'MarketCreated';
        } catch {
          return false;
        }
      });

      let marketId: number | undefined;
      if (event) {
        const parsed = this.marketFactory!.interface.parseLog(event);
        marketId = Number(parsed?.args.marketId);
      }

      return {
        success: true,
        marketId,
        txHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Error creating market:', error);
      return {
        success: false,
        error: error.message || 'Failed to create market'
      };
    }
  }

  // Place a stake on a market
  public async placeStake(marketId: number, prediction: boolean, amount: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.stakingContract) {
      return { success: false, error: 'Staking contract not available' };
    }

    try {
      const tx = await this.stakingContract.placeStake(marketId, prediction, {
        value: ethers.parseEther(amount)
      });

      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Error placing stake:', error);
      return {
        success: false,
        error: error.message || 'Failed to place stake'
      };
    }
  }

  // Get market details
  public async getMarket(marketId: number): Promise<{ success: boolean; market?: any; error?: string }> {
    if (!this.marketFactory) {
      return { success: false, error: 'MarketFactory contract not available' };
    }

    try {
      const market = await this.marketFactory.getMarket(marketId);
      return {
        success: true,
        market: {
          id: Number(market.id),
          title: market.title,
          description: market.description,
          marketType: market.marketType,
          region: market.region,
          endTime: Number(market.endTime),
          oracleType: market.oracleType,
          status: market.status,
          creator: market.creator,
          createdAt: Number(market.createdAt),
          resolved: market.resolved,
          outcome: market.outcome
        }
      };
    } catch (error: any) {
      console.error('Error getting market:', error);
      return {
        success: false,
        error: error.message || 'Failed to get market'
      };
    }
  }

  // Get total number of markets
  public async getTotalMarkets(): Promise<{ success: boolean; count?: number; error?: string }> {
    if (!this.marketFactory) {
      return { success: false, error: 'MarketFactory contract not available' };
    }

    try {
      const count = await this.marketFactory.getTotalMarkets();
      return {
        success: true,
        count: Number(count)
      };
    } catch (error: any) {
      console.error('Error getting total markets:', error);
      return {
        success: false,
        error: error.message || 'Failed to get total markets'
      };
    }
  }

  // Get user's stake for a market
  public async getUserStake(marketId: number, userAddress: string): Promise<{ success: boolean; stake?: string; error?: string }> {
    if (!this.stakingContract) {
      return { success: false, error: 'Staking contract not available' };
    }

    try {
      const stake = await this.stakingContract.getUserStake(marketId, userAddress);
      return {
        success: true,
        stake: ethers.formatEther(stake)
      };
    } catch (error: any) {
      console.error('Error getting user stake:', error);
      return {
        success: false,
        error: error.message || 'Failed to get user stake'
      };
    }
  }

  // Resolve a market (admin only)
  public async resolveMarket(marketId: number, outcome: boolean): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.resolutionContract) {
      return { success: false, error: 'Resolution contract not available' };
    }

    try {
      const tx = await this.resolutionContract.resolveMarket(marketId, outcome);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Error resolving market:', error);
      return {
        success: false,
        error: error.message || 'Failed to resolve market'
      };
    }
  }

  // Get market stakes
  public async getMarketStakes(marketId: number): Promise<{ success: boolean; stakes?: any; error?: string }> {
    if (!this.stakingContract) {
      return { success: false, error: 'Staking contract not available' };
    }

    try {
      const stakes = await this.stakingContract.getMarketStakes(marketId);
      return {
        success: true,
        stakes: {
          totalStaked: ethers.formatEther(stakes[0]),
          yesStake: ethers.formatEther(stakes[1]),
          noStake: ethers.formatEther(stakes[2]),
          participantCount: Number(stakes[3])
        }
      };
    } catch (error: any) {
      console.error('Error getting market stakes:', error);
      return {
        success: false,
        error: error.message || 'Failed to get market stakes'
      };
    }
  }

  // Check if market is resolved
  public async isMarketResolved(marketId: number): Promise<{ success: boolean; resolved?: boolean; error?: string }> {
    if (!this.resolutionContract) {
      return { success: false, error: 'Resolution contract not available' };
    }

    try {
      const resolved = await this.resolutionContract.isMarketResolved(marketId);
      return {
        success: true,
        resolved
      };
    } catch (error: any) {
      console.error('Error checking market resolution:', error);
      return {
        success: false,
        error: error.message || 'Failed to check market resolution'
      };
    }
  }

  // Reinitialize contracts (useful when network changes)
  public async reinitialize(): Promise<void> {
    await this.initializeProvider();
  }
}

// Create a singleton instance
export const contractService = new ContractService();
