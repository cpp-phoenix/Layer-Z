import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi'
import { usePublicClient } from 'wagmi'
import { utils, Wallet, Provider, EIP712Signer, types } from "zksync-web3";
import { ethers } from "ethers";
// import { KeyDIDMethod, createAndSignCredentialJWT } from "@jpmorganchase/onyx-ssi-sdk";
import nftABI from "./../nftABI.json";
import Navbar from "../components/Navbar.js";
import Walletbar from "../components/Walletbar.js";
import SendFlap from '../components/SendFlap';
import ReceiveFlap from '../components/ReceiveFlap';
import Login from '../components/Login';

function Home() {
    const { address, isConnected } = useAccount()
    const provider = usePublicClient()

    const [loggedin, setLoggedIn] = useState(false)
    const [ethBalance, setEthBalance] = useState(0)
    const [sendToken, showSendToken] = useState(false)
    const [receiveToken, showReceiveToken] = useState(false)
    const [abyssAddress, setAbyssAddress] = useState("")

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

                    setAbyssAddress(data.multiSig)

                    let balance = await _provider.getBalance(data.multiSig)
                    setEthBalance(ethers.utils.formatEther(balance))

                    setLoggedIn(true)
                }
            })();
        }
    },[isConnected])

    return (
        <div className="flex h-screen w-screen">
            {
                sendToken ? <SendFlap showSendToken={showSendToken} abyssAddress={abyssAddress}/> 
                : receiveToken ? <ReceiveFlap showReceiveToken={showReceiveToken} abyssAddress={abyssAddress}/> : <></>
            }
            <Navbar selected="Home"/>
            <div className="flex flex-col items-center w-full h-full">
                <Walletbar/>
                {
                    loggedin ? 
                    <div className='h-5/6 w-11/12 space-y-1'>
                        <div className='text-[#94A3B8]'>Total Eth Balance</div>
                        <div className='flex items-center space-x-10'>
                            <div className='font-semibold text-3xl'>{ethBalance} ETH</div>
                            <button onClick={() => showSendToken(!sendToken)} className='flex items-center space-x-2 rounded-full px-4 py-2 bg-[#f1f5f9] text-sm font-semibold'>
                                <div>Send</div>
                                <div className='rounded-full p-1 bg-[#07A65D] text-white'>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="-rotate-45 w-3.5 h-3.5"><path d="M4.16663 10H15.8333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 4.16669L15.8333 10L10 15.8334" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                </div>
                            </button>
                            <button onClick={() => showReceiveToken(!receiveToken)} className='flex items-center space-x-2 rounded-full px-4 py-2 bg-[#f1f5f9] text-sm font-semibold'>
                                <div>Receive</div>
                                <div className='rounded-full p-1 bg-[#07A65D] text-white'>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="rotate-[135deg] w-3.5 h-3.5"><path d="M4.16663 10H15.8333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 4.16669L15.8333 10L10 15.8334" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                </div>
                            </button>
                        </div>
                    </div> : <Login setLoggedIn={setLoggedIn}/>
                }
            </div>
        </div>
    )
}

export default Home;