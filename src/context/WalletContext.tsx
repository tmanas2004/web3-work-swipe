
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

type NetworkType = 'ethereum' | 'rootstock' | null;

type WalletContextType = {
  account: string | null;
  isConnecting: boolean;
  connectWallet: (network?: NetworkType) => Promise<void>;
  disconnectWallet: () => void;
  userRole: 'freelancer' | 'client' | null;
  setUserRole: (role: 'freelancer' | 'client' | null) => void;
  currentNetwork: NetworkType;
  switchNetwork: (network: NetworkType) => Promise<void>;
};

const WalletContext = createContext<WalletContextType>({
  account: null,
  isConnecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  userRole: null,
  setUserRole: () => {},
  currentNetwork: null,
  switchNetwork: async () => {},
});

export const useWallet = () => useContext(WalletContext);

const ROOTSTOCK_CHAIN_ID = '0x1e'; // 30 in decimal
const ROOTSTOCK_RPC_URL = 'https://public-node.rsk.co';

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'freelancer' | 'client' | null>(null);
  const [currentNetwork, setCurrentNetwork] = useState<NetworkType>(null);

  useEffect(() => {
    // Check if user was previously connected
    const savedAccount = localStorage.getItem('walletAccount');
    const savedRole = localStorage.getItem('userRole') as 'freelancer' | 'client' | null;
    const savedNetwork = localStorage.getItem('currentNetwork') as NetworkType;
    
    if (savedAccount) {
      setAccount(savedAccount);
    }
    
    if (savedRole) {
      setUserRole(savedRole);
    }

    if (savedNetwork) {
      setCurrentNetwork(savedNetwork);
    }

    // Add listener for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnectWallet();
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      localStorage.setItem('walletAccount', accounts[0]);
    }
  };

  const handleChainChanged = (chainId: string) => {
    // Handle chain changes
    if (chainId === ROOTSTOCK_CHAIN_ID) {
      setCurrentNetwork('rootstock');
      localStorage.setItem('currentNetwork', 'rootstock');
    } else {
      setCurrentNetwork('ethereum');
      localStorage.setItem('currentNetwork', 'ethereum');
    }
    
    // MetaMask recommends reloading the page on chain changes
    window.location.reload();
  };

  const connectWallet = async (network: NetworkType = 'ethereum') => {
    if (!window.ethereum) {
      toast.error('MetaMask not detected! Please install MetaMask to connect.');
      return;
    }

    setIsConnecting(true);

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        localStorage.setItem('walletAccount', accounts[0]);
        
        // Get current chain ID
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        // Set the network based on the chainId
        if (chainId === ROOTSTOCK_CHAIN_ID) {
          setCurrentNetwork('rootstock');
          localStorage.setItem('currentNetwork', 'rootstock');
        } else {
          setCurrentNetwork('ethereum');
          localStorage.setItem('currentNetwork', 'ethereum');
        }
        
        // Switch to requested network if different from current
        if (network && network !== currentNetwork) {
          await switchNetwork(network);
        }
        
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const switchNetwork = async (network: NetworkType) => {
    if (!window.ethereum) {
      toast.error('MetaMask not detected!');
      return;
    }

    try {
      if (network === 'rootstock') {
        // Switch to Rootstock
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ROOTSTOCK_CHAIN_ID }],
          });
        } catch (switchError: any) {
          // If the user doesn't have Rootstock network added, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: ROOTSTOCK_CHAIN_ID,
                  chainName: 'RSK Mainnet',
                  nativeCurrency: {
                    name: 'RSK BTC',
                    symbol: 'RBTC',
                    decimals: 18,
                  },
                  rpcUrls: [ROOTSTOCK_RPC_URL],
                  blockExplorerUrls: ['https://explorer.rsk.co/'],
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
        setCurrentNetwork('rootstock');
        localStorage.setItem('currentNetwork', 'rootstock');
        toast.success('Switched to Rootstock network');
      } else {
        // Switch to Ethereum (Mainnet)
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }], // Ethereum Mainnet
        });
        setCurrentNetwork('ethereum');
        localStorage.setItem('currentNetwork', 'ethereum');
        toast.success('Switched to Ethereum network');
      }
    } catch (error) {
      console.error('Error switching network:', error);
      toast.error('Failed to switch network');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setUserRole(null);
    setCurrentNetwork(null);
    localStorage.removeItem('walletAccount');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentNetwork');
    toast.info('Wallet disconnected');
  };

  const handleRoleChange = (role: 'freelancer' | 'client' | null) => {
    setUserRole(role);
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        isConnecting,
        connectWallet,
        disconnectWallet,
        userRole,
        setUserRole: handleRoleChange,
        currentNetwork,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (event: string, callback: (accounts: string[]) => void) => void;
    };
  }
}
