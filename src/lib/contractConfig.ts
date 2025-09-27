// Contract configuration and ABI for BlockDAG
export const CONTRACT_CONFIG = {
  // Update these addresses based on your BlockDAG deployment
  addresses: {
    // BlockDAG Awakening Testnet (Chain ID: 1043)
    1043: {
      marketFactory: "0x8BF1Df0361AadC2B316E224EF0Bae4b327034380",
      staking: "0x4f186F7d8CcD66D5FD4630527f40BdA238b009d2",
      resolution: "0x020209A91755158aCD616D9f4dFF1E9b8F6031d7",
    },
    // BlockDAG Testnet (Legacy)
    2001: {
      marketFactory: "0x8BF1Df0361AadC2B316E224EF0Bae4b327034380",
      staking: "0x4f186F7d8CcD66D5FD4630527f40BdA238b009d2",
      resolution: "0x020209A91755158aCD616D9f4dFF1E9b8F6031d7",
    },
    // BlockDAG Mainnet (Legacy)
    2000: {
      marketFactory: "0x8BF1Df0361AadC2B316E224EF0Bae4b327034380",
      staking: "0x4f186F7d8CcD66D5FD4630527f40BdA238b009d2",
      resolution: "0x020209A91755158aCD616D9f4dFF1E9b8F6031d7",
    },
  },
  // MarketFactory ABI
  marketFactoryABI: [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "marketId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "marketType",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "region",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        }
      ],
      "name": "MarketCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "uint8",
          "name": "_marketType",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "_region",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_endTime",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "_oracleType",
          "type": "uint8"
        }
      ],
      "name": "createMarket",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_marketId",
          "type": "uint256"
        }
      ],
      "name": "getMarket",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "enum MarketFactory.MarketType",
              "name": "marketType",
              "type": "uint8"
            },
            {
              "internalType": "string",
              "name": "region",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "enum MarketFactory.OracleType",
              "name": "oracleType",
              "type": "uint8"
            },
            {
              "internalType": "enum MarketFactory.MarketStatus",
              "name": "status",
              "type": "uint8"
            },
            {
              "internalType": "address",
              "name": "creator",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "resolved",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "outcome",
              "type": "bool"
            }
          ],
          "internalType": "struct MarketFactory.Market",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalMarkets",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_marketId",
          "type": "uint256"
        }
      ],
      "name": "isMarketOpen",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  // StakingContract ABI
  stakingABI: [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_marketId",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_prediction",
          "type": "bool"
        }
      ],
      "name": "placeStake",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_marketId",
          "type": "uint256"
        }
      ],
      "name": "getMarketStakes",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "totalStaked",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "yesStake",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "noStake",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "participantCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_marketId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getUserStake",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  // ResolutionContract ABI
  resolutionABI: [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_marketId",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_outcome",
          "type": "bool"
        }
      ],
      "name": "resolveMarket",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_marketId",
          "type": "uint256"
        }
      ],
      "name": "isMarketResolved",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_marketId",
          "type": "uint256"
        }
      ],
      "name": "getMarketOutcome",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
};

// Market type mappings
export const MARKET_TYPES = {
  Weather: 0,
  Crop: 1,
  Price: 2,
  Trade: 3,
  Policy: 4
} as const;

export const ORACLE_TYPES = {
  Manual: 0,
  Chainlink: 1,
  SAWS_API: 2
} as const;

export const MARKET_STATUS = {
  Open: 0,
  Resolving: 1,
  Closed: 2,
  Cancelled: 3
} as const;