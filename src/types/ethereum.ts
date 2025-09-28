// Ethereum provider types
export interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
  isMetaMask?: boolean;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export interface WalletState {
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchChain: (chainId: string) => Promise<void>;
  addBlockDAGNetwork: () => Promise<void>;
}
