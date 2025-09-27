// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ResolutionContract
 * @dev Contract for resolving prediction markets and triggering payouts
 * @author AgriRisk Team
 */
contract ResolutionContract is Ownable {
    
    // Market resolution struct
    struct MarketResolution {
        uint256 marketId;
        bool outcome; // true for Yes, false for No
        uint256 resolvedAt;
        address resolver;
        bool isResolved;
    }
    
    // State variables
    mapping(uint256 => MarketResolution) public resolutions;
    address public stakingContract;
    address public marketFactory;
    
    // Events
    event MarketResolved(
        uint256 indexed marketId,
        bool outcome,
        uint256 resolvedAt,
        address resolver
    );
    
    event PayoutsDistributed(
        uint256 indexed marketId,
        uint256 totalPayout
    );
    
    constructor(address _stakingContract, address _marketFactory) Ownable(msg.sender) {
        stakingContract = _stakingContract;
        marketFactory = _marketFactory;
    }
    
    /**
     * @dev Resolve a market with the outcome
     * @param _marketId Market ID
     * @param _outcome true for Yes, false for No
     */
    function resolveMarket(uint256 _marketId, bool _outcome) external onlyOwner {
        require(!resolutions[_marketId].isResolved, "Market already resolved");
        
        // Create resolution record
        resolutions[_marketId] = MarketResolution({
            marketId: _marketId,
            outcome: _outcome,
            resolvedAt: block.timestamp,
            resolver: msg.sender,
            isResolved: true
        });
        
        emit MarketResolved(_marketId, _outcome, block.timestamp, msg.sender);
        
        // Trigger payout distribution
        _triggerPayouts(_marketId, _outcome);
    }
    
    /**
     * @dev Internal function to trigger payouts
     * @param _marketId Market ID
     * @param _outcome Market outcome
     */
    function _triggerPayouts(uint256 _marketId, bool _outcome) internal {
        // Call staking contract to distribute payouts
        (bool success, ) = stakingContract.call(
            abi.encodeWithSignature("distributePayouts(uint256,bool)", _marketId, _outcome)
        );
        
        require(success, "Failed to distribute payouts");
        
        emit PayoutsDistributed(_marketId, _marketId); // Market ID as placeholder for total payout
    }
    
    /**
     * @dev Get market resolution details
     * @param _marketId Market ID
     * @return MarketResolution struct
     */
    function getResolution(uint256 _marketId) external view returns (MarketResolution memory) {
        return resolutions[_marketId];
    }
    
    /**
     * @dev Check if market is resolved
     * @param _marketId Market ID
     * @return True if market is resolved
     */
    function isMarketResolved(uint256 _marketId) external view returns (bool) {
        return resolutions[_marketId].isResolved;
    }
    
    /**
     * @dev Get market outcome
     * @param _marketId Market ID
     * @return Market outcome (true for Yes, false for No)
     */
    function getMarketOutcome(uint256 _marketId) external view returns (bool) {
        require(resolutions[_marketId].isResolved, "Market not resolved");
        return resolutions[_marketId].outcome;
    }
    
    /**
     * @dev Update staking contract address (only owner)
     * @param _newStakingContract New staking contract address
     */
    function updateStakingContract(address _newStakingContract) external onlyOwner {
        require(_newStakingContract != address(0), "Invalid address");
        stakingContract = _newStakingContract;
    }
    
    /**
     * @dev Update market factory address (only owner)
     * @param _newMarketFactory New market factory address
     */
    function updateMarketFactory(address _newMarketFactory) external onlyOwner {
        require(_newMarketFactory != address(0), "Invalid address");
        marketFactory = _newMarketFactory;
    }
    
    /**
     * @dev Emergency function to resolve multiple markets at once
     * @param _marketIds Array of market IDs
     * @param _outcomes Array of outcomes
     */
    function batchResolveMarkets(
        uint256[] calldata _marketIds,
        bool[] calldata _outcomes
    ) external onlyOwner {
        require(_marketIds.length == _outcomes.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < _marketIds.length; i++) {
            if (!resolutions[_marketIds[i]].isResolved) {
                this.resolveMarket(_marketIds[i], _outcomes[i]);
            }
        }
    }
}
