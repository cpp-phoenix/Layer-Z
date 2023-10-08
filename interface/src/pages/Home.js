import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi'
import { usePublicClient } from 'wagmi'
import { utils, Wallet, Provider, EIP712Signer, types } from "zksync-web3";
import { ethers } from "ethers";
// import { KeyDIDMethod, createAndSignCredentialJWT } from "@jpmorganchase/onyx-ssi-sdk";
import nftABI from "./../nftABI.json";
import { Core } from '@walletconnect/core'
import { Web3Wallet } from '@walletconnect/web3wallet'
import Navbar from "../components/Navbar.js";
import Walletbar from "../components/Walletbar.js";
import SendFlap from '../components/SendFlap';
import ReceiveFlap from '../components/ReceiveFlap';
import ConnectDappFlap from '../components/ConnectDappFlap';
import ApproveDappFlap from '../components/ApproveDappFlap';
import DisconnectDappFlap from '../components/DisconnectDappFlap';
import Login from '../components/Login';
import tokenABI from "./../tokenABI.json"
import { signClient } from './../utils/WalletConnectUtils'

function Home({initialized}) {
    const { address, isConnected } = useAccount()
    const provider = usePublicClient()
    
    const [pairData, setPairData] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [loggedin, setLoggedIn] = useState(false)
    const [ethBalance, setEthBalance] = useState(0)
    const [sendToken, showSendToken] = useState(false)
    const [receiveToken, showReceiveToken] = useState(false)
    const [connectDapp, showConnectDapp] = useState(false)
    const [approveDapp, showApproveDapp] = useState(false)
    const [disconnectDapp, showDisconnectDapp] = useState(false)
    const [event, setEvent] = useState(undefined)
    const [abyssAddress, setAbyssAddress] = useState("")

    useEffect(() => {
        if(initialized) {
            signClient.on('session_proposal', async event => {
                console.log('auth_request in Home', event)
                showConnectDapp(false)
                showApproveDapp(true)
                setEvent(event)
            })
        }
    },[initialized])

    const tokensList = {
        // "ETH": {
        //     symbol: "ETH",
        //     image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1696501628",
        //     contract: ""
        // },
        "USDT": {
            symbol: "USDT",
            image: "https://assets.coingecko.com/coins/images/325/small/Tether.png?1696501661",
            contract: "0x4B5DF730c2e6b28E17013A1485E5d9BC41Efe021",
        },
        "USDC": {
            symbol: "USDC",
            image: "https://assets.coingecko.com/coins/images/6319/small/usdc.png?1696506",
            contract: "0x111C3E89Ce80e62EE88318C2804920D4c96f92bb",
        },
        "DAI": {
            symbol: "DAI",
            image: "https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png?1696509996",
            contract: "0x26b368C3Ed16313eBd6660b72d8e4439a697Cb0B",
        }
    }

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
                    setIsLoading(false)
                }
            })();
        }
    },[isConnected])

    const TokenFlap = ({keydata}) => {
        const [amount, setAmount] = useState(0)
        const provider = new Provider("http://127.0.0.1:8011");

        const tokenFactory = new ethers.Contract(
            tokensList[keydata].contract,
            tokenABI,
            provider,
        );

        (async () => {
            let data = await tokenFactory.balanceOf(abyssAddress);
            setAmount(ethers.utils.formatEther(data));
        })()
        return (
            <div className='my-2'>
                <div className="w-full px-8 flex items-center justify-center font-semibold rounded-lg h-[70px]"> 
                    <div className='w-8 h-8 mr-3'><img src={tokensList[keydata].image}/></div>
                    <div className='flex-1 flex justify-start text-lg' >{tokensList[keydata].symbol}</div>
                    <div>{amount}</div>
                </div>
            </div>
        )
    }

    const showDisconnectTab = ({pair}) => {
        setPairData(pair)
        showDisconnectDapp(true)
    }

    return (
        <div className="flex h-screen w-screen">
            {
                sendToken ? <SendFlap showSendToken={showSendToken} abyssAddress={abyssAddress}/> 
                : receiveToken ? <ReceiveFlap showReceiveToken={showReceiveToken} abyssAddress={abyssAddress}/> : 
                  connectDapp ? <ConnectDappFlap showConnectDapp={showConnectDapp} abyssAddress={abyssAddress}/> : 
                  approveDapp ? <ApproveDappFlap showApproveDapp={showApproveDapp} event={event} abyssAddress={abyssAddress}/> : 
                  disconnectDapp ? <DisconnectDappFlap showDisconnectDapp={showDisconnectDapp} pairData={pairData}/> : <></>
            }
            <Navbar selected="Home"/>
            <div className="flex flex-col items-center w-full h-full">
                <Walletbar/>
                {
                    isLoading ? 
                    <div className='flex items-center justify-center w-full h-5/6'>
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-[#07A65D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div> : loggedin ? 
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
                        <div className='flex flex-col justify-end w-full h-[150px]'>
                            <div>
                                <button onClick={() => showConnectDapp(!connectDapp)} className='rounded-[22px] flex items-center space-x-2 border px-6 py-3 text-white bg-[#07A65D] hover:bg-green-500'>
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.55539 4.99997H1.44461" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 1.44458V8.55536" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                    <div className='text-sm font-semibold'>Connect Dapps</div>
                                    <svg width="19" height="12" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.89197 2.3456C6.98751 -0.781865 12.0125 -0.781865 15.108 2.3456L15.4807 2.72487C15.637 2.88031 15.637 3.13523 15.4807 3.29067L14.2064 4.57772C14.1283 4.65855 14.0021 4.65855 13.9239 4.57772L13.413 4.06166C11.2491 1.87927 7.75087 1.87927 5.587 4.06166L5.04002 4.61503C4.96188 4.69586 4.83565 4.69586 4.75751 4.61503L3.48323 3.32798C3.32695 3.17254 3.32695 2.91762 3.48323 2.76218L3.89197 2.3456ZM17.7468 5.00674L18.8828 6.15078C19.0391 6.30622 19.0391 6.56114 18.8828 6.71658L13.7676 11.8834C13.6114 12.0389 13.3589 12.0389 13.2086 11.8834L9.57814 8.21503C9.54208 8.17772 9.47596 8.17772 9.43989 8.21503L5.8094 11.8834C5.65312 12.0389 5.40066 12.0389 5.2504 11.8834L0.11721 6.71658C-0.0390699 6.56114 -0.0390699 6.30622 0.11721 6.15078L1.25324 5.00674C1.40952 4.8513 1.66197 4.8513 1.81224 5.00674L5.44274 8.67513C5.4788 8.71244 5.54492 8.71244 5.58099 8.67513L9.21149 5.00674C9.36777 4.8513 9.62022 4.8513 9.77049 5.00674L13.401 8.67513C13.437 8.71244 13.5032 8.71244 13.5392 8.67513L17.1697 5.00674C17.338 4.8513 17.5905 4.8513 17.7468 5.00674Z" fill="currentColor"></path></svg>
                                </button>
                            </div>
                            <div>
                                {
                                    initialized ? 
                                    <div className='flex pt-2 space-x-3'>
                                        {
                                            signClient !== null && signClient.core !==  null && signClient.core.pairing !== null && signClient.core.pairing.getPairings().filter(pair => pair.active).map(pair => {
                                                console.log("Pair Data: ", pair)
                                                return (
                                                    <button onClick={() => {showDisconnectTab({pair})}} className='flex items-center rounded-[20px] p-2 space-x-2 bg-[#F8FAFC] px-4'>
                                                        <div className='w-6 h-6'><img className='rounded-full' src={pair.peerMetadata.icons[0]}/></div>
                                                        <div>
                                                            <div className='text-xs font-semibold'>{pair.peerMetadata.name}</div>
                                                            <div className={`text-xs font-semibold ${pair.active ? "text-[#07A65D]" : "text-[#EB5757]"}`}>{pair.active ? "connected" : "inactive"}</div>
                                                        </div>
                                                        <div className='w-[30px] flex justify-end'><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-slate-400 h-[18px] w-[18px]"><path d="M10.5 3.5L3.5 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div>
                                                    </button>
                                                )
                                            })
                                        }
                                    </div> : ""
                                }
                            </div>
                        </div>
                        <div className='space-y-4'>
                            <div className='font-semibold'>Balances (3)</div>
                            <div className='bg-[#f8fafc] rounded-[20px] w-full h-[400px] overflow-y-scroll'>
                            {
                                ["USDC","USDT","DAI"].map(keydata => {
                                    return(
                                        <TokenFlap keydata={keydata}/>
                                    )
                                })
                            }
                            </div>
                        </div>
                    </div> : <Login setLoggedIn={setLoggedIn}/>
                }
            </div>
        </div>
    )
}

export default Home;