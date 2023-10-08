import './App.css';
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { walletConnectProvider } from '@web3modal/wagmi'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import Home from './pages/Home';

// 1. Get projectId
const projectId = process.env.REACT_APP_WAGMI_PROJECT_ID

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

// 2. Create wagmiConfig
const { chains, publicClient } = configureChains(
  [zksyncDevnet],
  [walletConnectProvider({ projectId }), publicProvider()]
)

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({ chains, options: { projectId, showQrModal: false, metadata } }),
  ],
  publicClient
})

createWeb3Modal({ wagmiConfig, projectId, chains })

function App() {

  return (
    <WagmiConfig config={wagmiConfig}>
      <div className='h-screen'>
        <div className='flex justify-end w-full border-b-2 py-4 px-4'>
          <w3m-button />
        </div>
        <Home/>
      </div>
    </WagmiConfig>
  );
}

export default App;
