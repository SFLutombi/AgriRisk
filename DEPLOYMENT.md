# BlockDAG Deployment Guide - Modular Contracts

## Contract Architecture

The AgriRisk platform now uses **3 separate contracts** for better modularity and gas efficiency:

### 1. **MarketFactory.sol**
- **Purpose**: Creates and manages prediction markets
- **Functions**: `createMarket()`, `getMarket()`, `getTotalMarkets()`
- **Admin Functions**: `updateMarketStatus()`, `markMarketResolved()`

### 2. **StakingContract.sol**
- **Purpose**: Handles user stakes and payouts
- **Functions**: `placeStake()`, `getMarketStakes()`, `getUserStake()`
- **Admin Functions**: `distributePayouts()`, `updatePlatformFee()`

### 3. **ResolutionContract.sol**
- **Purpose**: Resolves markets and triggers payouts
- **Functions**: `resolveMarket()`, `isMarketResolved()`, `getMarketOutcome()`
- **Admin Functions**: `batchResolveMarkets()`

## Deployment Steps

### Step 1: Deploy Contracts via BlockDAG IDE

1. Go to [BlockDAG IDE](https://ide.primordial.bdagscan.com/)
2. Deploy contracts in this order:

#### Deploy StakingContract first:
```solidity
// Copy StakingContract.sol to IDE
// Deploy with no constructor parameters
```

#### Deploy MarketFactory second:
```solidity
// Copy MarketFactory.sol to IDE
// Deploy with no constructor parameters
```

#### Deploy ResolutionContract third:
```solidity
// Copy ResolutionContract.sol to IDE
// Deploy with constructor parameters:
// _stakingContract: [StakingContract address]
// _marketFactory: [MarketFactory address]
```

### Step 2: Update Frontend Configuration

Update `src/lib/contractConfig.ts` with your deployed addresses:

```typescript
addresses: {
  // BlockDAG Testnet
  2001: {
    marketFactory: "0xYourMarketFactoryAddress",
    staking: "0xYourStakingContractAddress", 
    resolution: "0xYourResolutionContractAddress",
  },
  // BlockDAG Mainnet
  2000: {
    marketFactory: "0xYourMarketFactoryAddress",
    staking: "0xYourStakingContractAddress",
    resolution: "0xYourResolutionContractAddress",
  },
}
```

### Step 3: Add BlockDAG Network to MetaMask

Add this network to MetaMask (get actual values from BlockDAG docs):

- **Network Name**: BlockDAG Testnet
- **RPC URL**: [Get from BlockDAG documentation]
- **Chain ID**: [Get from BlockDAG documentation]
- **Currency Symbol**: BDAG
- **Block Explorer**: [Get from BlockDAG documentation]

## Contract Interactions

### Market Creation Flow:
1. Admin calls `MarketFactory.createMarket()`
2. Market is created and stored
3. Market ID is returned

### Staking Flow:
1. User calls `StakingContract.placeStake()`
2. ETH is sent to staking contract
3. Stake is recorded

### Resolution Flow:
1. Admin calls `ResolutionContract.resolveMarket()`
2. Resolution contract calls `StakingContract.distributePayouts()`
3. Winners receive payouts, platform fee goes to owner

## Benefits of Modular Architecture

- **Gas Efficiency**: Smaller contracts, lower deployment costs
- **Modularity**: Each contract has a single responsibility
- **Upgradability**: Can upgrade individual contracts
- **Security**: Isolated functionality reduces attack surface
- **Maintainability**: Easier to debug and modify

## Testing the Integration

1. Connect MetaMask to BlockDAG network
2. Click "Create Market" button in Admin Dashboard
3. Verify transaction appears on BlockDAG explorer
4. Test staking functionality
5. Test market resolution

## Files to Update After Deployment

1. `src/lib/contractConfig.ts` - Add all 3 contract addresses
2. MetaMask - Add BlockDAG network configuration
3. Test all functionality end-to-end