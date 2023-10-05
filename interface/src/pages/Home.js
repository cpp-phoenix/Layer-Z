import { useEffect } from 'react';
import { useAccount } from 'wagmi'
import { usePublicClient } from 'wagmi'
// import { KeyDIDMethod, createAndSignCredentialJWT } from "@jpmorganchase/onyx-ssi-sdk";

import Navbar from "../components/Navbar.js";
import Walletbar from "../components/Walletbar.js";

function Home() {
    const { isConnected } = useAccount()
    const provider = usePublicClient()

    useEffect(() => {
        if(isConnected) {
            (async () => {
                console.log("Testing")
            })();
        }
    },[isConnected])

    return (
        <div className="flex h-screen w-screen">
            <Navbar selected="Home"/>
            <div className="w-full">
                <Walletbar/>
                <div>
                    
                </div>
            </div>
        </div>
    )
}

export default Home;