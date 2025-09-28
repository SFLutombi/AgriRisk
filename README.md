# 🌾 AgriRisk: Blockchain-Powered Agricultural Prediction Markets

Agricultural communities face unpredictable risks from weather, market prices, and policy changes. AgriRisk transforms these uncertainties into opportunities through decentralized prediction markets, enabling farmers to hedge risks and earn from accurate predictions.

🎬 **Demo Video**  
👉 [Watch Demo](https://agri-risk.vercel.app/)  
👉 [Live App](https://www.loom.com/share/3153e25b37d949f89afb5d7dcf8fc466?sid=09f0c5da-14a6-4c9f-a857-1ac629f441f3)

## 💡 Why It Matters (Impact)

- **Risk Hedging for Farmers**: Turn weather and market uncertainty into predictable income streams
- **Community-Driven Insights**: Leverage collective wisdom of agricultural communities for better predictions
- **Transparent Market Data**: Blockchain ensures fair, tamper-proof market resolution and payouts
- **Accessible Financial Tools**: Micro-stakes make risk management available to small-scale farmers
- **Real-World Impact**: Accurate predictions help farmers make better planting and selling decisions

## 🏆 How We Meet Judging Criteria

### **Impact on Agriculture**
From smallholder farmers to large agricultural operations, AgriRisk provides accessible risk management tools that were previously only available to large corporations.

Farmers can now hedge against weather risks, price volatility, and policy changes through transparent, community-driven prediction markets.

### **Technical Skill & Scalability**
- Built a fully functional demo with MetaMask integration and deployed smart contracts on BlockDAG
- Implemented market creation, staking, and automated resolution with real-time blockchain verification
- Created a complete prediction market platform with admin dashboard and user portfolio management
- Integrated Clerk authentication and role-based access control for secure market administration

### **Clear Blockchain Use Case**
- **Immutable Market Records**: Blockchain ensures market outcomes and payouts are permanently recorded and tamper-proof
- **Smart Contract Automation**: Automatic resolution and payout distribution eliminate the need for trusted intermediaries
- **Transparent Staking**: All stakes and payouts are publicly verifiable on the blockchain
- **Decentralized Governance**: Market creation and resolution controlled by smart contracts, not centralized authorities

### **Creative Use of Blockchain Tools**
- **Agricultural Data as Assets**: Weather patterns, crop prices, and policy outcomes become tradeable prediction markets
- **Community Wisdom Monetization**: Farmers' local knowledge and experience becomes valuable through accurate predictions
- **Micro-Risk Management**: Small stakes enable risk hedging for farmers who couldn't access traditional financial instruments
- **Cross-Border Agricultural Insights**: Global prediction markets for agricultural events that affect farmers worldwide

## ⚡ Why Blockchain Makes This Possible

AgriRisk is only viable because blockchain technology removes the exact barriers that prevent traditional agricultural risk management:

- **Low-Cost Micro-Stakes**: Traditional financial instruments have high minimums. Blockchain enables 1-10 USD stakes for small farmers
- **Instant Settlement**: Payouts arrive immediately when markets resolve, giving farmers confidence in the system
- **Transparency Without Intermediaries**: Every market outcome and payout is publicly verifiable
- **Global Accessibility**: Farmers anywhere can participate in prediction markets for global agricultural events

👉 **Blockchain isn't just powering AgriRisk — it's creating entirely new possibilities for agricultural risk management.**

## 🚀 Growth Potential

Existing agricultural risk management tools face significant limitations:

- **Traditional Insurance** – High premiums, complex claims processes, and limited coverage for small farmers
- **Futures Markets** – High barriers to entry, complex instruments, and focus on large-scale operations
- **Government Programs** – Bureaucratic, slow, and often insufficient coverage

👉 **AgriRisk, powered by blockchain, overcomes these barriers:**

- **Accessible Risk Management** – Any farmer with a smartphone can participate in prediction markets
- **Community-Driven Pricing** – Market prices reflect collective wisdom rather than corporate risk models
- **Transparent Payouts** – Smart contracts ensure fair and immediate resolution
- **Global Market Access** – Farmers can hedge against international events affecting their local markets

This isn't just scaling within agricultural communities—it's creating a global network of agricultural risk management where local knowledge meets global markets.

## 🔄 System Overview

**Farmer → Market Prediction → Smart Contract → Blockchain Staking → Market Resolution → Payout Distribution**

## 👨‍💻 Developer Guide

### 🚀 Quickstart

```bash
# Clone repo
git clone https://github.com/your-repo/agririsk-prediction-markets.git
cd agririsk-prediction-markets

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Clerk and blockchain credentials

# Run dev server
npm run dev
```

### 📋 Smart Contract Structure

**MarketFactory.sol**
- `createMarket()` - Creates new prediction markets
- `getMarket()` - Retrieves market details
- `getMarketCount()` - Returns total number of markets

**StakingContract.sol**
- `placeStake()` - Handles user predictions and stakes
- `getMarketStakes()` - Returns market statistics
- `distributePayouts()` - Distributes winnings to correct predictions

**ResolutionContract.sol**
- `resolveMarket()` - Sets market outcomes
- `getResolution()` - Retrieves resolution details
- `isMarketResolved()` - Checks if market is resolved

### 🔧 Deployment (Blockchain)

```bash
# Compile contracts
cd contracts
npm install
npx hardhat compile

# Deploy to BlockDAG Awakening Testnet
npx hardhat deploy --network awakening-testnet

# Deploy to BlockDAG Mainnet
npx hardhat deploy --network blockdag-mainnet
```

### ⚙️ Environment Variables

Create `.env.local` file:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Blockchain (BlockDAG Awakening Testnet)
VITE_ETHEREUM_NETWORK=awakening-testnet
VITE_CONTRACT_ADDRESSES={"marketFactory":"0x...","staking":"0x...","resolution":"0x..."}

# RPC Configuration
VITE_BLOCKDAG_RPC_URL=https://rpc.awakening.bdagscan.com
VITE_BLOCKDAG_EXPLORER=https://awakening.bdagscan.com
```

### 🔌 API Endpoints

- `POST /api/markets` - Create new prediction market
- `POST /api/stake` - Place stake on market
- `GET /api/markets/:id` - Fetch market details
- `GET /api/portfolio/:wallet` - View user's stakes and earnings

## 🤝 Contributing Guide

### Getting Started

```bash
git clone https://github.com/your-username/agririsk-prediction-markets.git
cd agririsk-prediction-markets
npm install
cp .env.example .env.local
npm run dev
```

### Common Contributions

**Testing Smart Contracts**
```bash
cd contracts
npx hardhat test
# Or test specific file
npx hardhat test test/MarketFactory.test.js
```

**Adding Smart Contracts**
Create in `contracts/` directory:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NewContract {
    // Your logic here
}
```

**Submitting Changes**
```bash
git checkout -b feature/your-feature
git add . && git commit -m "feat: description"
git push origin feature/your-feature
# Create Pull Request
```

**Guidelines**: Use TypeScript, Tailwind CSS, Shadcn/ui components, and conventional commits.

## 🌟 How You Can Help

AgriRisk abstracts away the complexity of traditional financial instruments. Farmers stake seamlessly, receive payouts seamlessly — all powered by blockchain under the hood.

You can:

- **Contribute Code** - Add features like automated market creation, advanced analytics, or mobile app
- **Create Markets** - Propose new prediction markets for agricultural events
- **Participate in Markets** - Stake on predictions and earn from accurate forecasts
- **Partner with Us** - Agricultural organizations, cooperatives, and research institutions can integrate this model

👉 **For farmers, this means accessible risk management. For communities, it means collective wisdom monetization. For partners, it means scalable agricultural insights with proof.**

The problems that held back agricultural risk management — high costs, complex instruments, limited accessibility — are now solved through blockchain technology.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/ui
- **Authentication**: Clerk
- **Blockchain**: BlockDAG, Ethers.js
- **Smart Contracts**: Solidity, Hardhat
- **State Management**: React Context, SWR
- **Charts**: Recharts

## 📄 License

MIT License © 2025 AgriRisk
