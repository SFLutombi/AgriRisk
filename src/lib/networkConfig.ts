// Network configuration for BlockDAG
export const NETWORK_CONFIG = {
  // BlockDAG Awakening Testnet
  awakening: {
    chainId: 1043,
    chainName: 'Awakening Testnet',
    nativeCurrency: {
      name: 'BDAG',
      symbol: 'BDAG',
      decimals: 18,
    },
    rpcUrls: [
      'https://rpc.awakening.bdagscan.com',
      'relay.awakening.bdagscan.com'
    ],
    blockExplorerUrls: ['https://awakening.bdagscan.com/'],
    faucetUrl: 'https://awakening.bdagscan.com/faucet',
  },
  // BlockDAG Testnet (Legacy)
  testnet: {
    chainId: 2001,
    chainName: 'BlockDAG Testnet',
    nativeCurrency: {
      name: 'BDAG',
      symbol: 'BDAG',
      decimals: 18,
    },
    rpcUrls: [
      'https://rpc.testnet.bdagscan.com',
    ],
    blockExplorerUrls: ['https://testnet.bdagscan.com/'],
  },
  // BlockDAG Mainnet (Legacy)
  mainnet: {
    chainId: 2000,
    chainName: 'BlockDAG Mainnet',
    nativeCurrency: {
      name: 'BDAG',
      symbol: 'BDAG',
      decimals: 18,
    },
    rpcUrls: [
      'https://rpc.mainnet.bdagscan.com',
    ],
    blockExplorerUrls: ['https://bdagscan.com/'],
  },
};

// Helper function to get network config by chain ID
export const getNetworkConfig = (chainId: number) => {
  switch (chainId) {
    case 1043:
      return NETWORK_CONFIG.awakening;
    case 2001:
      return NETWORK_CONFIG.testnet;
    case 2000:
      return NETWORK_CONFIG.mainnet;
    default:
      return null;
  }
};

// Helper function to add network to MetaMask
export const addNetworkToMetaMask = async (chainId: number) => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const networkConfig = getNetworkConfig(chainId);
  if (!networkConfig) {
    throw new Error(`Network with chain ID ${chainId} is not supported`);
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: `0x${chainId.toString(16)}`,
        chainName: networkConfig.chainName,
        nativeCurrency: networkConfig.nativeCurrency,
        rpcUrls: networkConfig.rpcUrls,
        blockExplorerUrls: networkConfig.blockExplorerUrls,
      }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      // Chain already added
      return;
    }
    throw error;
  }
};
