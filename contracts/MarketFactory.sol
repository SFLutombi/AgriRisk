// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MarketFactory
 * @dev Contract for creating and managing prediction markets
 * @author AgriRisk Team
 */
contract MarketFactory is Ownable {
    
    // Market type enum
    enum MarketType {
        Weather,
        Crop,
        Price,
        Trade,
        Policy
    }
    
    // Oracle type enum
    enum OracleType {
        Manual,
        Chainlink,
        SAWS_API
    }
    
    // Market status enum
    enum MarketStatus {
        Open,
        Resolving,
        Closed,
        Cancelled
    }
    
    // Market struct
    struct Market {
        uint256 id;
        string title;
        string description;
        MarketType marketType;
        string region;
        uint256 endTime;
        OracleType oracleType;
        MarketStatus status;
        address creator;
        uint256 createdAt;
        bool resolved;
        bool outcome; // true for Yes, false for No
    }
    
    // State variables
    uint256 private _marketIdCounter;
    mapping(uint256 => Market) public markets;
    mapping(address => uint256[]) public creatorMarkets;
    
    // Events
    event MarketCreated(
        uint256 indexed marketId,
        address indexed creator,
        string title,
        MarketType marketType,
        string region,
        uint256 endTime
    );
    
    event MarketStatusUpdated(uint256 indexed marketId, MarketStatus status);
    
    constructor() Ownable(msg.sender) {
        _marketIdCounter = 1; // Start from 1
    }
    
    /**
     * @dev Create a new prediction market
     * @param _title Market title/question
     * @param _description Detailed description
     * @param _marketType Type of market
     * @param _region Geographic region
     * @param _endTime Unix timestamp when market closes
     * @param _oracleType Type of oracle for resolution
     */
    function createMarket(
        string memory _title,
        string memory _description,
        MarketType _marketType,
        string memory _region,
        uint256 _endTime,
        OracleType _oracleType
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_endTime > block.timestamp, "End time must be in the future");
        
        uint256 marketId = _marketIdCounter;
        _marketIdCounter++;
        
        markets[marketId] = Market({
            id: marketId,
            title: _title,
            description: _description,
            marketType: _marketType,
            region: _region,
            endTime: _endTime,
            oracleType: _oracleType,
            status: MarketStatus.Open,
            creator: msg.sender,
            createdAt: block.timestamp,
            resolved: false,
            outcome: false
        });
        
        creatorMarkets[msg.sender].push(marketId);
        
        emit MarketCreated(
            marketId,
            msg.sender,
            _title,
            _marketType,
            _region,
            _endTime
        );
        
        return marketId;
    }
    
    /**
     * @dev Update market status (only owner)
     * @param _marketId Market ID
     * @param _status New status
     */
    function updateMarketStatus(uint256 _marketId, MarketStatus _status) external onlyOwner {
        require(markets[_marketId].id != 0, "Market does not exist");
        markets[_marketId].status = _status;
        emit MarketStatusUpdated(_marketId, _status);
    }
    
    /**
     * @dev Mark market as resolved (only owner)
     * @param _marketId Market ID
     * @param _outcome Market outcome
     */
    function markMarketResolved(uint256 _marketId, bool _outcome) external onlyOwner {
        require(markets[_marketId].id != 0, "Market does not exist");
        require(!markets[_marketId].resolved, "Market already resolved");
        
        markets[_marketId].resolved = true;
        markets[_marketId].outcome = _outcome;
        markets[_marketId].status = MarketStatus.Closed;
        
        emit MarketStatusUpdated(_marketId, MarketStatus.Closed);
    }
    
    /**
     * @dev Get market details
     * @param _marketId Market ID
     * @return Market struct
     */
    function getMarket(uint256 _marketId) external view returns (Market memory) {
        require(markets[_marketId].id != 0, "Market does not exist");
        return markets[_marketId];
    }
    
    /**
     * @dev Get markets created by a specific address
     * @param _creator Creator address
     * @return Array of market IDs
     */
    function getCreatorMarkets(address _creator) external view returns (uint256[] memory) {
        return creatorMarkets[_creator];
    }
    
    /**
     * @dev Get total number of markets created
     * @return Total market count
     */
    function getTotalMarkets() external view returns (uint256) {
        return _marketIdCounter - 1;
    }
    
    /**
     * @dev Check if market exists
     * @param _marketId Market ID
     * @return True if market exists
     */
    function marketExists(uint256 _marketId) external view returns (bool) {
        return markets[_marketId].id != 0;
    }
    
    /**
     * @dev Check if market is open for staking
     * @param _marketId Market ID
     * @return True if market is open
     */
    function isMarketOpen(uint256 _marketId) external view returns (bool) {
        Market memory market = markets[_marketId];
        return market.id != 0 && 
               market.status == MarketStatus.Open && 
               block.timestamp < market.endTime;
    }
}
