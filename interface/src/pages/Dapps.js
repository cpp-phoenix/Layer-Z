import { useEffect, useState } from "react";
import { useAccount } from 'wagmi'
import { usePublicClient } from 'wagmi'
import { ethers } from "ethers";
// import { KeyDIDMethod, createAndSignCredentialJWT } from "@jpmorganchase/onyx-ssi-sdk";
import nftABI from "./../nftABI.json";
import Navbar from "../components/Navbar.js";
import { utils, Wallet, Provider, EIP712Signer, types } from "zksync-web3";
import Walletbar from "../components/Walletbar.js";
import Login from '../components/Login';

function Dapps() {
    const { address, isConnected } = useAccount()
    const provider = usePublicClient()

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
                }
            })();
        }
    },[isConnected])

    return (
        <div className="flex h-screen w-screen">
            <Navbar selected="Dapps"/>
            <div className="w-full">
                <Walletbar/>
                {
                    loggedin ? <div>Logged In</div> : <Login setLoggedIn={setLoggedIn}/>
                }
            </div>
        </div>
    )
}

export default Dapps;