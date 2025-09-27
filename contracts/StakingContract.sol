// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title StakingContract
 * @dev Contract for handling user stakes on prediction markets
 * @author AgriRisk Team
 */
contract StakingContract is Ownable, ReentrancyGuard {
    
    // Stake struct
    struct Stake {
        address staker;
        bool prediction; // true for Yes, false for No
        uint256 amount;
        uint256 timestamp;
    }
    
    // Market stakes struct
    struct MarketStakes {
        uint256 totalStaked;
        uint256 yesStake;
        uint256 noStake;
        uint256 participantCount;
        Stake[] stakes;
    }
    
    // State variables
    mapping(uint256 => MarketStakes) public marketStakes;
    mapping(uint256 => mapping(address => uint256)) public userStakes;
    mapping(uint256 => mapping(address => bool)) public hasStaked;
    
    // Platform fee (2.5% = 250 basis points)
    uint256 public platformFee = 250;
    uint256 public constant BASIS_POINTS = 10000;
    
    // Events
    event StakePlaced(
        uint256 indexed marketId,
        address indexed staker,
        bool prediction,
        uint256 amount
    );
    
    event StakeWithdrawn(
        uint256 indexed marketId,
        address indexed staker,
        uint256 amount
    );
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Place a stake on a market prediction
     * @param _marketId Market ID
     * @param _prediction true for Yes, false for No
     */
    function placeStake(uint256 _marketId, bool _prediction) 
        external 
        payable 
        nonReentrant 
    {
        require(msg.value > 0, "Stake amount must be greater than 0");
        
        // Add stake to market
        marketStakes[_marketId].stakes.push(Stake({
            staker: msg.sender,
            prediction: _prediction,
            amount: msg.value,
            timestamp: block.timestamp
        }));
        
        // Update market totals
        MarketStakes storage stakes = marketStakes[_marketId];
        stakes.totalStaked += msg.value;
        if (_prediction) {
            stakes.yesStake += msg.value;
        } else {
            stakes.noStake += msg.value;
        }
        
        // Update participant count if first stake from this user
        if (!hasStaked[_marketId][msg.sender]) {
            stakes.participantCount++;
            hasStaked[_marketId][msg.sender] = true;
        }
        
        // Update user stakes
        userStakes[_marketId][msg.sender] += msg.value;
        
        emit StakePlaced(_marketId, msg.sender, _prediction, msg.value);
    }
    
    /**
     * @dev Get market stake information
     * @param _marketId Market ID
     * @return totalStaked Total amount staked in the market
     * @return yesStake Total amount staked on "Yes" outcome
     * @return noStake Total amount staked on "No" outcome
     * @return participantCount Number of participants in the market
     */
    function getMarketStakes(uint256 _marketId) external view returns (
        uint256 totalStaked,
        uint256 yesStake,
        uint256 noStake,
        uint256 participantCount
    ) {
        MarketStakes memory stakes = marketStakes[_marketId];
        return (stakes.totalStaked, stakes.yesStake, stakes.noStake, stakes.participantCount);
    }
    
    /**
     * @dev Get user's stake amount for a market
     * @param _marketId Market ID
     * @param _user User address
     * @return Stake amount
     */
    function getUserStake(uint256 _marketId, address _user) external view returns (uint256) {
        return userStakes[_marketId][_user];
    }
    
    /**
     * @dev Get all stakes for a market
     * @param _marketId Market ID
     * @return Array of stakes
     */
    function getMarketStakesArray(uint256 _marketId) external view returns (Stake[] memory) {
        return marketStakes[_marketId].stakes;
    }
    
    /**
     * @dev Calculate payout for a winning stake
     * @param _marketId Market ID
     * @param _outcome Market outcome
     * @return Total payout amount
     */
    function calculatePayout(uint256 _marketId, bool _outcome) external view returns (uint256) {
        MarketStakes memory stakes = marketStakes[_marketId];
        uint256 winningStake = _outcome ? stakes.yesStake : stakes.noStake;
        
        if (winningStake == 0) {
            return 0;
        }
        
        // Calculate platform fee
        uint256 feeAmount = (stakes.totalStaked * platformFee) / BASIS_POINTS;
        uint256 payoutPool = stakes.totalStaked - feeAmount;
        
        return payoutPool;
    }
    
    /**
     * @dev Distribute payouts to winners (only owner)
     * @param _marketId Market ID
     * @param _outcome Market outcome
     */
    function distributePayouts(uint256 _marketId, bool _outcome) external onlyOwner {
        MarketStakes storage stakes = marketStakes[_marketId];
        uint256 winningStake = _outcome ? stakes.yesStake : stakes.noStake;
        
        if (winningStake == 0) {
            return; // No winners to pay
        }
        
        // Calculate platform fee and payout pool
        uint256 feeAmount = (stakes.totalStaked * platformFee) / BASIS_POINTS;
        uint256 payoutPool = stakes.totalStaked - feeAmount;
        
        // Distribute payouts to winners
        for (uint256 i = 0; i < stakes.stakes.length; i++) {
            Stake storage stake = stakes.stakes[i];
            if (stake.prediction == _outcome) {
                uint256 payout = (stake.amount * payoutPool) / winningStake;
                payable(stake.staker).transfer(payout);
            }
        }
        
        // Transfer platform fee to owner
        if (feeAmount > 0) {
            payable(owner()).transfer(feeAmount);
        }
    }
    
    /**
     * @dev Update platform fee (only owner)
     * @param _newFee New fee in basis points
     */
    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee cannot exceed 10%"); // Max 10%
        platformFee = _newFee;
    }
    
    /**
     * @dev Get contract balance
     * @return Contract balance in wei
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Withdraw contract balance (only owner)
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner()).transfer(balance);
    }
}

