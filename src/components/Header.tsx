import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/context/WalletContext';
import { formatAddress } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { account, connectWallet, disconnectWallet, userRole } = useWallet();
  const [isScrolled, setIsScrolled] = useState(false);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 20);
    });
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-web3-primary to-web3-tertiary bg-clip-text text-transparent">
            RSKWork
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {userRole && (
            <nav className="hidden md:flex items-center space-x-4">
              {userRole === 'freelancer' ? (
                <>
                  <Link to="/jobs" className="text-sm font-medium hover:text-web3-primary transition-colors">
                    Find Work
                  </Link>
                  <Link to="/dashboard" className="text-sm font-medium hover:text-web3-primary transition-colors">
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/post-job" className="text-sm font-medium hover:text-web3-primary transition-colors">
                    Post a Job
                  </Link>
                  <Link to="/talent" className="text-sm font-medium hover:text-web3-primary transition-colors">
                    Find Talent
                  </Link>
                  <Link to="/dashboard" className="text-sm font-medium hover:text-web3-primary transition-colors">
                    Dashboard
                  </Link>
                </>
              )}
              <Link to="/messages" className="text-sm font-medium hover:text-web3-primary transition-colors">
                Messages
              </Link>
            </nav>
          )}

          {account ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-web3-primary text-web3-primary hover:bg-web3-light/20">
                  {formatAddress(account)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Rootstock Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={disconnectWallet}>
                  Disconnect Wallet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="default"
              className="bg-web3-primary hover:bg-web3-secondary text-white"
              onClick={connectWallet}
            >
              Connect to Rootstock
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
