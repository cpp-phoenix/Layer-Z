import { signClient } from './../utils/WalletConnectUtils'
import { useEffect } from 'react'

export default function useWalletConnectEventsManager(initialized) {
  /******************************************************************************
   * Set up WalletConnect event listeners
   *****************************************************************************/
  useEffect(() => {
    if (initialized) {
        signClient.on('session_proposal', async event => {
            console.log('auth_request in proposal', event)
        })

        signClient.on('session_delete', async event => {
            console.log("Session is deleted: ", event)
        })

        signClient.core.pairing.events.on("pairing_delete", async event => {
            console.log("Pairing is deleted: ", event)
        });

        signClient.on('session_request', event => {
            console.log("Handle session request: ", event)
          
          })
    }
  }, [initialized])
}
