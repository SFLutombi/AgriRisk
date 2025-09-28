import { ethers } from 'ethers';

// Contract addresses for different networks
export const CONTRACT_CONFIG = {
  addresses: {
    // BlockDAG Awakening Testnet (Chain ID: 1043)
    "1043": {
      marketFactory: "0x15b09fCc8dEbB3dB3ed6fCa9d3F59af91f3858f4",
      staking: "0x985B4a014De88A78330cB351d265A8FF75fA3E13",
      resolution: "0xB0eeE19a4AdF41c1E837CB4Fe828A992a7a61E54"
    },
    // BlockDAG Testnet (Chain ID: 2001) - Alternative testnet
    "2001": {
      marketFactory: "0xf372DD4c4B4A06BC7B815dA0A46C4Fd425D8FA7b",
      staking: "0x84164Dcd07211D994e1c04d2eD466F10485b084C",
      resolution: "0x52BA895AD91B61477B4A5344D21f75d3B1238189"
    },
    // BlockDAG Mainnet (Chain ID: 2000) - Future mainnet
    "2000": {
      marketFactory: "0xf372DD4c4B4A06BC7B815dA0A46C4Fd425D8FA7b",
      staking: "0x84164Dcd07211D994e1c04d2eD466F10485b084C",
      resolution: "0x52BA895AD91B61477B4A5344D21f75d3B1238189"
    }
  },

  // MarketFactory ABI
  marketFactoryABI: [
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
          "internalType": "uint256",
          "name": "_endTime",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "_oracleType",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "_resolutionSource",
          "type": "string"
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
              "internalType": "uint8",
              "name": "marketType",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "oracleType",
              "type": "uint8"
            },
            {
              "internalType": "string",
              "name": "resolutionSource",
              "type": "string"
            },
            {
              "internalType": "uint8",
              "name": "status",
              "type": "uint8"
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
      "name": "getMarketCount",
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
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
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
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_marketFactory",
          "type": "address"
        }
      ],
      "name": "setMarketFactory",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_resolutionContract",
          "type": "address"
        }
      ],
      "name": "setResolutionContract",
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
        },
        {
          "internalType": "bool",
          "name": "_outcome",
          "type": "bool"
        }
      ],
      "name": "distributePayouts",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "marketFactory",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "resolutionContract",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
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
      "name": "getResolution",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "marketId",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "outcome",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "resolvedAt",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "resolvedBy",
              "type": "address"
            }
          ],
          "internalType": "struct ResolutionContract.MarketResolution",
          "name": "",
          "type": "tuple"
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

export const MARKET_STATUS_NAMES = {
  0: "Open",
  1: "Resolving", 
  2: "Closed",
  3: "Cancelled"
} as const;