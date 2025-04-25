
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

type WalletContextType = {
  account: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  userRole: 'freelancer' | 'client' | null;
  setUserRole: (role: 'freelancer' | 'client' | null) => void;
};

const WalletContext = createContext<WalletContextType>({
  account: null,
  isConnecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  userRole: null,
  setUserRole: () => {},
});

export const useWallet = () => useContext(WalletContext);

const ROOTSTOCK_CHAIN_ID = '0x1e'; // 30 in decimal
const ROOTSTOCK_RPC_URL = 'https://public-node.rsk.co';

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'freelancer' | 'client' | null>(null);

  useEffect(() => {
    const savedAccount = localStorage.getItem('walletAccount');
    const savedRole = localStorage.getItem('userRole') as 'freelancer' | 'client' | null;
    
    if (savedAccount) {
      setAccount(savedAccount);
    }
    
    if (savedRole) {
      setUserRole(savedRole);
    }

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      localStorage.setItem('walletAccount', accounts[0]);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask not detected! Please install MetaMask to connect.');
      return;
    }

    setIsConnecting(true);

    try {
      // Switch to Rootstock network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ROOTSTOCK_CHAIN_ID }],
        });
      } catch (switchError: any) {
        // Add Rootstock network if not already added
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

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        localStorage.setItem('walletAccount', accounts[0]);
        toast.success('Connected to Rootstock network successfully!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect to Rootstock network');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setUserRole(null);
    localStorage.removeItem('walletAccount');
    localStorage.removeItem('userRole');
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
