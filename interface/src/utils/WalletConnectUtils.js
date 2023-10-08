import SignClient from '@walletconnect/sign-client'
import { Core } from '@walletconnect/core'

const core = new Core({
  projectId: process.env.REACT_APP_WAGMI_PROJECT_ID
})

export let signClient

export async function createAuthClient() {
    signClient = await SignClient.init({
        core,
        projectId: process.env.REACT_APP_WAGMI_PROJECT_ID,
        relayUrl: 'wss://relay.walletconnect.com',
        metadata: {
          name: 'React Wallet',
          description: 'React Wallet for WalletConnect',
          url: 'https://walletconnect.com/',
          icons: ['https://avatars.githubusercontent.com/u/37784886']
        }
      })
    const authClientId = await signClient.core.crypto.getClientId()
    console.log({ authClientId })
}
