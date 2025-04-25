export interface Profile {
  id: string;
  name: string;
  avatar: string;
  did?: string;
  lensHandle?: string;
  skills?: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  rating?: number;
  completedJobs?: number;
}

export interface JobPost {
  id: string;
  title: string;
  description: string;
  client: Profile;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  duration: string;
  skills: string[];
  category: string;
  postedAt: string;
  location: 'remote' | 'onsite' | 'hybrid';
  immediate: boolean;
  blockchain: 'rootstock';
}

// Mock client profiles
export const mockClients: Profile[] = [
  {
    id: '1',
    name: 'Decentralia Labs',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Decentralia&backgroundColor=9b87f5',
    did: 'did:ethr:0x1234567890abcdef',
    lensHandle: '@decentralia',
    rating: 4.8,
    completedJobs: 24
  },
  {
    id: '2',
    name: 'Blockchain Ventures',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Blockchain&backgroundColor=7E69AB',
    did: 'did:ethr:0xabcdef1234567890',
    lensHandle: '@blockchainventures',
    rating: 4.6,
    completedJobs: 18
  },
  {
    id: '3',
    name: 'CryptoDesign Co',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=CryptoDesign&backgroundColor=6E59A5',
    did: 'did:ethr:0x9876543210abcdef',
    lensHandle: '@cryptodesign',
    rating: 4.9,
    completedJobs: 32
  },
  {
    id: '4',
    name: 'NFT Creators Guild',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=NFTCreators&backgroundColor=D6BCFA',
    did: 'did:ethr:0xabcdef0987654321',
    lensHandle: '@nftcreators',
    rating: 4.7,
    completedJobs: 41
  },
  {
    id: '5',
    name: 'DeFi Protocol',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=DeFiProtocol&backgroundColor=9b87f5',
    did: 'did:ethr:0x1234abcdef567890',
    lensHandle: '@defiprotocol',
    rating: 4.5,
    completedJobs: 15
  }
];

// Update mockJobs to be Rootstock-only
export const mockJobs: JobPost[] = [
  {
    id: '1',
    title: 'Rootstock Smart Contract Developer',
    description: 'Looking for an experienced Rootstock developer to help build DeFi protocols on RSK.',
    client: mockClients[0],
    budget: {
      min: 2000,
      max: 5000,
      currency: 'RBTC'
    },
    duration: '2-4 weeks',
    skills: ['Rootstock', 'Solidity', 'RSK', 'DeFi'],
    category: 'Smart Contract Development',
    postedAt: '2h ago',
    location: 'remote',
    immediate: true,
    blockchain: 'rootstock'
  },
  {
    id: '2',
    title: 'RSK DApp Frontend Developer',
    description: 'Frontend developer needed for building a decentralized application on Rootstock.',
    client: mockClients[1],
    budget: {
      min: 1500,
      max: 3000,
      currency: 'RBTC'
    },
    duration: '1-2 months',
    skills: ['React', 'TypeScript', 'Web3.js', 'RSK'],
    category: 'Frontend Development',
    postedAt: '5h ago',
    location: 'remote',
    immediate: false,
    blockchain: 'rootstock'
  },
  {
    id: '3',
    title: 'Rootstock Security Auditor',
    description: 'Security expert needed to audit smart contracts on the RSK network.',
    client: mockClients[2],
    budget: {
      min: 3000,
      max: 7000,
      currency: 'RBTC'
    },
    duration: '2 weeks',
    skills: ['Security', 'Audit', 'RSK', 'Smart Contracts'],
    category: 'Security',
    postedAt: '1d ago',
    location: 'remote',
    immediate: true,
    blockchain: 'rootstock'
  }
];
