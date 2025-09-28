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

      console.log('Initializing contracts with addresses:', networkAddresses);
      console.log('StakingContract ABI length:', CONTRACT_CONFIG.stakingABI.length);

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

      console.log('Contracts initialized successfully');
      console.log('StakingContract interface functions:', this.stakingContract.interface.fragments.map(f => f.name));
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
    endTime: number;
    oracleType: string;
    resolutionSource?: string;
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

      // Preflight: verify caller is owner (most factories restrict createMarket to owner)
      try {
        if (typeof (this.marketFactory as any).owner === 'function') {
          const factoryOwner = await (this.marketFactory as any).owner();
          const caller = await this.signer!.getAddress();
          if (factoryOwner?.toLowerCase() !== caller.toLowerCase()) {
            return { success: false, error: 'Only contract owner can create markets' };
          }
        }
      } catch (e) {
        console.warn('Owner preflight check skipped or failed:', (e as any)?.message || e);
      }

      // Validate end time
      if (!marketData.endTime || marketData.endTime <= Math.floor(Date.now() / 1000)) {
        return { success: false, error: 'End time must be a future timestamp' };
      }

      // Call the createMarket function.
      // Primary attempt uses ABI order: (title, description, marketType, endTime, oracleType, resolutionSource)
      let tx;
      try {
        tx = await this.marketFactory.createMarket(
          marketData.title,
          marketData.description,
          marketTypeEnum,
          marketData.endTime,
          oracleTypeEnum,
          marketData.resolutionSource ?? 'Admin Manual Resolution'
        );
      } catch (primaryError: any) {
        console.warn('Primary createMarket call failed, retrying with swapped last-arg order:', primaryError?.message || primaryError);
        // Fallback attempt for deployed factories where the last two params are swapped:
        // (title, description, marketType, endTime, resolutionSource, oracleType)
        try {
          tx = await (this.marketFactory as any).createMarket(
            marketData.title,
            marketData.description,
            marketTypeEnum,
            marketData.endTime,
            marketData.resolutionSource ?? 'Admin Manual Resolution',
            oracleTypeEnum
          );
        } catch (fallbackError: any) {
          console.warn('Fallback (swap) failed, trying 5-arg variant (no resolutionSource):', fallbackError?.message || fallbackError);
          // Fallback 2: (title, description, marketType, endTime, oracleType)
          try {
            tx = await (this.marketFactory as any).createMarket(
              marketData.title,
              marketData.description,
              marketTypeEnum,
              marketData.endTime,
              oracleTypeEnum
            );
          } catch (fallback5Error: any) {
            console.warn('Fallback 5-arg failed, trying 4-arg variant (no oracleType, no resolutionSource):', fallback5Error?.message || fallback5Error);
            // Fallback 3: (title, description, marketType, endTime)
            try {
              tx = await (this.marketFactory as any).createMarket(
                marketData.title,
                marketData.description,
                marketTypeEnum,
                marketData.endTime
              );
            } catch (fallback4Error: any) {
              console.warn('Fallback 4-arg failed, trying raw contract call:', fallback4Error?.message || fallback4Error);
              // Fallback 4: Try raw contract call with common createMarket selector
              try {
                // Try the most common createMarket signature: (string, string, uint8, uint256)
                const iface = new ethers.Interface([
                  "function createMarket(string memory _title, string memory _description, uint8 _marketType, uint256 _endTime) public"
                ]);
                const data = iface.encodeFunctionData("createMarket", [
                  marketData.title,
                  marketData.description,
                  marketTypeEnum,
                  marketData.endTime
                ]);
                
                const tx = await this.signer!.sendTransaction({
                  to: await this.marketFactory.getAddress(),
                  data: data
                });
                
                const receipt = await tx.wait();
                return { success: true, txHash: receipt.hash };
              } catch (rawError: any) {
                console.error('All createMarket variants failed:', rawError);
                return { success: false, error: `Contract function signature mismatch. Please check the deployed contract ABI. Error: ${rawError?.message || 'Unknown error'}` };
              }
            }
          }
        }
      }

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
      console.log('Placing stake with params:', {
        marketId,
        prediction,
        amount,
        value: ethers.parseEther(amount).toString()
      });

      // Check if contracts are properly linked
      try {
        const marketFactoryAddress = await this.stakingContract.marketFactory();
        console.log('MarketFactory address in StakingContract:', marketFactoryAddress);
        
        if (marketFactoryAddress === "0x0000000000000000000000000000000000000000") {
          return {
            success: false,
            error: 'Contracts are not properly linked. Please contact admin to link MarketFactory to StakingContract.'
          };
        }
      } catch (error) {
        console.log('Error checking MarketFactory address:', error);
        return {
          success: false,
          error: 'Unable to verify contract linkage. Please contact admin.'
        };
      }

      // First, let's check if the market exists by trying to get market stakes
      try {
        const marketStakes = await this.stakingContract.getMarketStakes(marketId);
        console.log('Market stakes before staking:', marketStakes);
      } catch (error) {
        console.log('Error getting market stakes (market might not exist):', error);
        return {
          success: false,
          error: 'Market does not exist or is not accessible'
        };
      }

      // Check if market is open in MarketFactory
      try {
        if (this.marketFactory) {
          const isOpen = await this.marketFactory.isMarketOpen(marketId);
          console.log('Market is open:', isOpen);
          if (!isOpen) {
            return {
              success: false,
              error: 'Market is not open for staking'
            };
          }
        }
      } catch (error) {
        console.log('Error checking if market is open:', error);
        return {
          success: false,
          error: 'Unable to verify market status'
        };
      }

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
      
      // Try to extract more specific error information
      let errorMessage = 'Failed to place stake';
      
      if (error.code === 'CALL_EXCEPTION') {
        if (error.data === null) {
          errorMessage = 'Transaction failed - contracts may not be properly linked. Please contact admin.';
        } else {
          errorMessage = error.reason || error.message || 'Transaction failed';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage
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

    // First verify the contract exists
    const contractAddress = await this.marketFactory.getAddress();
    const contractExists = await this.verifyContractExists(contractAddress);
    if (!contractExists) {
      return {
        success: false,
        error: `No MarketFactory contract found at address ${contractAddress}. Please verify the contract address is correct.`
      };
    }
    console.log(`MarketFactory exists at ${contractAddress}:`, contractExists);

    // Test basic contract functionality first
    try {
      console.log('Testing MarketFactory basic functionality...');
      console.log('Available functions:', this.marketFactory.interface.fragments.map(f => f.name));
      
      // Try to call a simple function to test if contract is working
      if (typeof this.marketFactory.getMarketCount === 'function') {
        console.log('Calling getMarketCount()...');
        const count = await this.marketFactory.getMarketCount();
        console.log('getMarketCount() result:', count);
        return { success: true, count: Number(count) };
      } else {
        console.log('getMarketCount() function not available in ABI');
      }
    } catch (error: any) {
      console.error('Error calling getMarketCount():', error);
      console.warn('getMarketCount() failed, trying fallbacks:', error?.message || error);
    }

    // Fallback 1: marketCount()
    try {
      if (typeof (this.marketFactory as any).marketCount === 'function') {
        const count = await (this.marketFactory as any).marketCount();
        return { success: true, count: Number(count) };
      }
    } catch (error: any) {
      console.warn('marketCount() failed, trying totalMarkets():', error?.message || error);
    }

    // Fallback 2: totalMarkets()
    try {
      if (typeof (this.marketFactory as any).totalMarkets === 'function') {
        const count = await (this.marketFactory as any).totalMarkets();
        return { success: true, count: Number(count) };
      }
    } catch (error: any) {
      console.warn('totalMarkets() failed, probing indices:', error?.message || error);
    }

    // Fallback 3: Probe indices by calling getMarket(i) until it errors (cap to avoid long loops)
    try {
      let i = 0;
      const MAX_PROBE = 50;
      for (; i < MAX_PROBE; i++) {
        try {
          // Expect getMarket(uint256) to exist per ABI we have
          // If it throws, we've reached the end
          // We don't need the value, only that it doesn't revert
          // eslint-disable-next-line no-await-in-loop
          await this.marketFactory.getMarket(i);
        } catch {
          break;
        }
      }
      return { success: true, count: i };
    } catch (error: any) {
      console.error('All strategies to get total markets failed:', error);
      return { success: false, error: error.message || 'Failed to get total markets' };
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

  // Get market resolution details
  public async getResolution(marketId: number): Promise<{ success: boolean; resolution?: any; error?: string }> {
    if (!this.resolutionContract) {
      return { success: false, error: 'Resolution contract not available' };
    }

    try {
      const resolution = await this.resolutionContract.getResolution(marketId);
      return {
        success: true,
        resolution
      };
    } catch (error: any) {
      console.error('Error getting market resolution:', error);
      return {
        success: false,
        error: error.message || 'Failed to get market resolution'
      };
    }
  }

  // Set MarketFactory address in StakingContract (admin function)
  public async setMarketFactoryInStaking(): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.stakingContract || !this.marketFactory) {
      return { success: false, error: 'Contracts not available' };
    }

    try {
      // Debug: Check if the function exists
      console.log('setMarketFactory function exists:', typeof this.stakingContract.setMarketFactory);
      
      if (typeof this.stakingContract.setMarketFactory !== 'function') {
        return {
          success: false,
          error: 'setMarketFactory function not available in ABI. Please refresh the page to load updated ABI.'
        };
      }

      const marketFactoryAddress = await this.marketFactory.getAddress();
      console.log('Setting MarketFactory address:', marketFactoryAddress);
      
      const tx = await this.stakingContract.setMarketFactory(marketFactoryAddress);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Error setting MarketFactory in StakingContract:', error);
      return {
        success: false,
        error: error.message || 'Failed to set MarketFactory'
      };
    }
  }

  public async setResolutionContractInStaking(): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.stakingContract || !this.resolutionContract) {
      return { success: false, error: 'Contracts not available' };
    }

    try {
      // Debug: Check if the function exists
      console.log('setResolutionContract function exists:', typeof this.stakingContract.setResolutionContract);
      
      if (typeof this.stakingContract.setResolutionContract !== 'function') {
        return {
          success: false,
          error: 'setResolutionContract function not available in ABI. Please refresh the page to load updated ABI.'
        };
      }

      const resolutionContractAddress = await this.resolutionContract.getAddress();
      console.log('Setting ResolutionContract address:', resolutionContractAddress);
      
      const tx = await this.stakingContract.setResolutionContract(resolutionContractAddress);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Error setting ResolutionContract in StakingContract:', error);
      return {
        success: false,
        error: error.message || 'Failed to set ResolutionContract'
      };
    }
  }

  // Check if contract exists at address
  public async verifyContractExists(address: string): Promise<boolean> {
    if (!this.provider) return false;
    try {
      const code = await this.provider.getCode(address);
      return code !== '0x';
    } catch (error) {
      console.error('Error checking contract code:', error);
      return false;
    }
  }

  // Check contract linkage status
  public async checkContractLinkage(): Promise<{ 
    success: boolean; 
    marketFactoryLinked?: boolean; 
    resolutionContractLinked?: boolean; 
    error?: string 
  }> {
    if (!this.stakingContract) {
      return { success: false, error: 'Staking contract not available' };
    }

    // First verify the contract exists
    const contractAddress = await this.stakingContract.getAddress();
    const contractExists = await this.verifyContractExists(contractAddress);
    if (!contractExists) {
      return {
        success: false,
        error: `No contract found at address ${contractAddress}. Please verify the contract address is correct.`
      };
    }
    console.log(`Contract exists at ${contractAddress}:`, contractExists);

    try {
      // Debug: Check if the functions exist
      console.log('StakingContract methods:', Object.getOwnPropertyNames(this.stakingContract));
      console.log('StakingContract interface:', this.stakingContract.interface);
      console.log('Available functions:', this.stakingContract.interface.fragments.map(f => f.name));
      console.log('marketFactory function exists:', typeof this.stakingContract.marketFactory);
      console.log('resolutionContract function exists:', typeof this.stakingContract.resolutionContract);
      
      // Test with a basic function first
      try {
        console.log('Testing contract connection...');
        console.log('Contract address:', await this.stakingContract.getAddress());
        console.log('Network:', await this.provider?.getNetwork());
        
        const owner = await this.stakingContract.owner();
        console.log('Contract owner:', owner);
      } catch (ownerError) {
        console.error('Error calling owner() function:', ownerError);
        console.error('Contract address:', await this.stakingContract.getAddress());
        console.error('Network:', await this.provider?.getNetwork());
        return {
          success: false,
          error: `Contract not accessible: ${ownerError.message}`
        };
      }
      
      // Check if functions are available
      if (typeof this.stakingContract.marketFactory !== 'function') {
        return {
          success: false,
          error: 'marketFactory getter function not available in ABI. Please refresh the page to load updated ABI.'
        };
      }
      
      if (typeof this.stakingContract.resolutionContract !== 'function') {
        return {
          success: false,
          error: 'resolutionContract getter function not available in ABI. Please refresh the page to load updated ABI.'
        };
      }

      const marketFactoryAddress = await this.stakingContract.marketFactory();
      const resolutionContractAddress = await this.stakingContract.resolutionContract();
      
      console.log('MarketFactory address:', marketFactoryAddress);
      console.log('ResolutionContract address:', resolutionContractAddress);
      
      return {
        success: true,
        marketFactoryLinked: marketFactoryAddress !== "0x0000000000000000000000000000000000000000",
        resolutionContractLinked: resolutionContractAddress !== "0x0000000000000000000000000000000000000000"
      };
    } catch (error: any) {
      console.error('Error checking contract linkage:', error);
      return {
        success: false,
        error: error.message || 'Failed to check contract linkage'
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
