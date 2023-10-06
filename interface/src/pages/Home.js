import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi'
import { usePublicClient } from 'wagmi'
import { ethers } from "ethers";
// import { KeyDIDMethod, createAndSignCredentialJWT } from "@jpmorganchase/onyx-ssi-sdk";
import soulBoundABI from "./../soulBoundABI.json";
import Navbar from "../components/Navbar.js";
import Walletbar from "../components/Walletbar.js";

function Home() {
    const { address, isConnected } = useAccount()
    const provider = usePublicClient()

    const [loggedin, setLoggedIn] = useState(false)

    useEffect(() => {
        if(isConnected) {
            (async () => {
                const soulBountContract = new ethers.Contract(process.env.REACT_APP_NFT_CREATOR_CONTRACT, soulBoundABI, provider);
                let tokenId = soulBountContract.tokenID(address);
                console.log("tokenDI si:" + tokenId)
            })();
        }
    },[isConnected])

    return (
        <div className="flex h-screen w-screen">
            <Navbar selected="Home" loggedin={loggedin}/>
            <div className="w-full">
                <Walletbar/>
                <div>
                    
                </div>
            </div>
        </div>
    )
}

export default Home;