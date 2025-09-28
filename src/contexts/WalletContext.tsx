import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { WalletState, WalletContextType, EthereumProvider } from '@/types/ethereum';
import { addNetworkToMetaMask, getNetworkConfig } from '@/lib/networkConfig';

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    account: null,
    chainId: null,
    isLoading: false,
    error: null,
  });

  const checkConnection = async () => {
    if (!window.ethereum) return;

    // Check if user has manually disconnected
    const isDisconnected = localStorage.getItem('wallet-disconnected') === 'true';
    if (isDisconnected) {
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const network = await provider.getNetwork();
        setWalletState({
          isConnected: true,
          account: accounts[0].address,
          chainId: network.chainId.toString(),
          isLoading: false,
          error: null,
        });
        // Clear the disconnect flag since we're connected
        localStorage.removeItem('wallet-disconnected');
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connect = async () => {
    if (!window.ethereum) {
      setWalletState(prev => ({
        ...prev,
        error: 'MetaMask is not installed. Please install MetaMask to connect your wallet.',
      }));
      return;
    }

    setWalletState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        const network = await provider.getNetwork();
        setWalletState({
          isConnected: true,
          account: accounts[0],
          chainId: network.chainId.toString(),
          isLoading: false,
          error: null,
        });
        // Clear the disconnect flag since we're connected
        localStorage.removeItem('wallet-disconnected');
      }
    } catch (error: any) {
      let errorMessage = 'Failed to connect wallet';
      
      if (error.code === 4001) {
        errorMessage = 'User rejected the connection request';
      } else if (error.code === -32002) {
        errorMessage = 'Connection request already pending';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  const disconnect = async () => {
    try {
      // Clear the local state immediately
      setWalletState({
        isConnected: false,
        account: null,
        chainId: null,
        isLoading: false,
        error: null,
      });

      // Store disconnect state in localStorage to prevent auto-reconnection
      localStorage.setItem('wallet-disconnected', 'true');

      // If MetaMask is available, we can try to revoke permissions
      // Note: MetaMask doesn't have a direct disconnect method, but we can
      // clear the connection by removing the site from connected sites
      if (window.ethereum && window.ethereum.isMetaMask) {
        try {
          // This will prompt the user to disconnect the site from MetaMask
          await window.ethereum.request({
            method: 'wallet_revokePermissions',
            params: [
              {
                eth_accounts: {},
              },
            ],
          });
        } catch (error) {
          // If revoke permissions fails, that's okay - the local state is already cleared
          console.log('Could not revoke permissions (this is normal):', error);
        }
      }
    } catch (error) {
      console.error('Error during disconnect:', error);
      // Even if there's an error, we still want to clear the local state
      setWalletState({
        isConnected: false,
        account: null,
        chainId: null,
        isLoading: false,
        error: null,
      });
      localStorage.setItem('wallet-disconnected', 'true');
    }
  };

  const switchChain = async (chainId: string) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${parseInt(chainId).toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added to MetaMask, try to add it
        try {
          await addNetworkToMetaMask(parseInt(chainId));
          // After adding, try to switch again
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${parseInt(chainId).toString(16)}` }],
          });
        } catch (addError: any) {
          setWalletState(prev => ({
            ...prev,
            error: 'Failed to add network to MetaMask',
          }));
        }
      } else {
        setWalletState(prev => ({
          ...prev,
          error: 'Failed to switch network',
        }));
      }
    }
  };

  const addBlockDAGNetwork = async () => {
    if (!window.ethereum) {
      setWalletState(prev => ({
        ...prev,
        error: 'MetaMask is not installed',
      }));
      return;
    }

    try {
      await addNetworkToMetaMask(1043); // Add Awakening Testnet
      setWalletState(prev => ({
        ...prev,
        error: null,
      }));
    } catch (error: any) {
      setWalletState(prev => ({
        ...prev,
        error: error.message || 'Failed to add BlockDAG network',
      }));
    }
  };

  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setWalletState(prev => ({
            ...prev,
            account: accounts[0],
          }));
        }
      };

      const handleChainChanged = (chainId: string) => {
        setWalletState(prev => ({
          ...prev,
          chainId: parseInt(chainId, 16).toString(),
        }));
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const contextValue: WalletContextType = {
    ...walletState,
    connect,
    disconnect,
    switchChain,
    addBlockDAGNetwork,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
