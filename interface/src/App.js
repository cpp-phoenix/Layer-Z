import './App.css';
import '@rainbow-me/rainbowkit/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import Home from './pages/Home.js';
import Dapps from './pages/Dapps.js';
import Transactions from './pages/Transactions.js';
import useInitialization from './hooks/useInitialization'
import useWalletConnectEventsManager from './hooks/useWalletConnectEventsManager'

export const zksyncDevnet = {
  id: 260,
  name: 'Zksync Devnet',
  network: 'zksync',
  nativeCurrency: {
    decimals: 18,
    name: 'Zksync',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['http://localhost:8011'] },
    default: { http: ['http://localhost:8011'] },
  },
}

const { chains, publicClient } = configureChains(
  [zksyncDevnet],
  [
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Abyss',
  projectId: process.env.REACT_APP_WAGMI_PROJECT_ID,
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

function App() {

  const initialized = useInitialization()

  useWalletConnectEventsManager(initialized)

  return (
    <div className='h-screen w-screen'>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <Router>
            <Routes>
              <Route path='/' exact element={<Home initialized={initialized}/>}/>
              <Route path='/dapps' exact element={<Dapps/>}/>
              <Route path='/txns' exact element={<Transactions/>}/>
            </Routes>
          </Router>
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
