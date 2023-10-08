import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi'
import { usePublicClient } from 'wagmi'
import { ethers } from "ethers";
// import { KeyDIDMethod, createAndSignCredentialJWT } from "@jpmorganchase/onyx-ssi-sdk";
import nftABI from "./../nftABI.json";
import { utils, Wallet, Provider, EIP712Signer, types } from "zksync-web3";
import Navbar from "../components/Navbar.js";
import Walletbar from "../components/Walletbar.js";
import Login from '../components/Login';

function Transactions() {
    const { address, isConnected } = useAccount()
    const provider = usePublicClient()

    const [isLoading, setIsLoading] = useState(true)
    const [loggedin, setLoggedIn] = useState(false)

    useEffect(() => {
        if(isConnected) {
            (async () => {
                const _provider = new Provider("http://127.0.0.1:8011");
                const soulBountContract = new ethers.Contract(process.env.REACT_APP_NFT_CREATOR_CONTRACT, nftABI, _provider);
                let tokenId = await soulBountContract.tokenID(address);
                if(tokenId > 0) {
                    let tokenURI = await soulBountContract.tokenURI(tokenId)
                    let response = await fetch(tokenURI)
                    let data = await response.json()
                    setLoggedIn(true)
                    setIsLoading(false)
                }
            })();
        }
    },[isConnected])

    return (
        <div className="flex h-screen w-screen">
            <Navbar selected="Transactions"/>
            <div className="w-full">
                <Walletbar/>
                {
                    isLoading ? 
                    <div className='flex items-center justify-center w-full h-5/6'>
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-[#07A65D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div> : loggedin ? <div></div> : <Login setLoggedIn={setLoggedIn}/>
                }
            </div>
        </div>
    )
}

export default Transactions;