import './App.css';
import '@rainbow-me/rainbowkit/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import Navbar from './components/Navbar';
import Balances from './components/Balances';
import Transactions from './pages/Transactions';
import Transfer from './pages/Transfer';
import Yield from './pages/Yield';
import Faucet from './pages/Faucet';

export const mevm = {
  id: 307_32,
  name: 'Movement',
  network: 'Movement',
  nativeCurrency: {
    decimals: 18,
    name: 'MOVE',
    symbol: 'MOVE',
  },
  rpcUrls: {
    public: { http: ['https://mevm.devnet.imola.movementlabs.xyz'] },
    default: { http: ['https://mevm.devnet.imola.movementlabs.xyz'] },
  },
  blockExplorers: {
    etherscan: { name: 'imola', url: '' },
    default: { name: 'imola', url: '' },
  },
}

const { chains, publicClient } = configureChains(
  [{
    ...mevm,
    iconUrl: 'https://docs.movementnetwork.xyz/img/logo.svg'
  }],
  [
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Alpha',
  projectId: '5f003c980b0077487fe5501454d63922',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <div className="bg-[#FFD013] w-screen h-screen">
          <Router>
            <Navbar/>  
            <div className='flex justify-between'>
              <div>
                <Routes>
                  <Route path='/' exact element={<Yield/>}/>
                  <Route path='/transfer' exact element={<Transfer/>}/>
                  <Route path='/transactions' exact element={<Transactions/>}/>
                  <Route path='/faucet' exact element={<Faucet/>}/>
                </Routes>
              </div>
              <Balances/>
            </div>
          </Router>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
