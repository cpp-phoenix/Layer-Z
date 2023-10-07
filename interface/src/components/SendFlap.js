import { useState } from 'react';
import { useAccount } from 'wagmi'
import { usePublicClient, useWalletClient } from 'wagmi'
import { signMessage } from '@wagmi/core'
import { ethers } from "ethers";
import { Wallet, Provider, utils, EIP712Signer } from "zksync-web3";
import factoryABI from "./../factoryABI.json"
import multisigABI from "./../multisigABI.json"
import tokenABI from "./../tokenABI.json"


function SendFlap({showSendToken, abyssAddress}) {

    const { data: signer } = useWalletClient()
    const { address, isConnected } = useAccount()

    const [receiverAddress, setReceiverAddress] = useState("")
    const [receiverAmount, setReceiverAmount] = useState(0)
    const [currentToken, setCurrentToken] = useState("USDC")

    const[showTokensList, setShowTokensList] = useState(false)

    const tokensList = {
        // "ETH": {
        //     symbol: "ETH",
        //     image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1696501628",
        //     contract: ""
        // },
        "USDT": {
            symbol: "USDT",
            image: "https://assets.coingecko.com/coins/images/325/small/Tether.png?1696501661",
            contract: "0x4B5DF730c2e6b28E17013A1485E5d9BC41Efe021"
        },
        "USDC": {
            symbol: "USDC",
            image: "https://assets.coingecko.com/coins/images/6319/small/usdc.png?1696506",
            contract: "0x111C3E89Ce80e62EE88318C2804920D4c96f92bb"
        },
        "DAI": {
            symbol: "DAI",
            image: "https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png?1696509996",
            contract: "0x26b368C3Ed16313eBd6660b72d8e4439a697Cb0B"
        }
    }

    const transferToken = async () => {
        console.log(receiverAddress)
        console.log(receiverAmount)

        if(receiverAddress.length > 0 && receiverAmount > 0) {
            const provider = new Provider("http://127.0.0.1:8011");

            const aaFactory = new ethers.Contract(
                process.env.REACT_APP_FACTORY_ADDRESS,
                factoryABI,
                provider,
            );

            const tokenFactory = new ethers.Contract(
                tokensList[currentToken].contract,
                tokenABI,
                provider,
            );

            const salt = ethers.constants.HashZero;

            const owner1 = Wallet.createRandom();

            // let aaTx = await aaFactory.populateTransaction.deployAccount(
            //     salt,
            //     owner1.address,
            // );
            
            let aaTx = await tokenFactory.populateTransaction.transfer(
                receiverAddress,
                ethers.utils.parseEther(receiverAmount),
            );

            // const gasLimit = await provider.estimateGas(aaTx);
            const gasPrice = await provider.getGasPrice();
            
            aaTx = {
                ...aaTx,
                // deploy a new account using the multisig
                from: abyssAddress,
                gasLimit: gasPrice,
                gasPrice: gasPrice,
                chainId: (await provider.getNetwork()).chainId,
                nonce: await provider.getTransactionCount(abyssAddress),
                type: 113,
                customData: {
                    gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
                },
                value: ethers.BigNumber.from(0),
            };
            
            const signedTxHash = EIP712Signer.getSignedDigest(aaTx);

            const wallet = new Wallet("0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3").connect(provider);

            const signature = ethers.utils.concat([
                // Note, that `signMessage` wouldn't work here, since we don't want
                // the signed hash to be prefixed with `\x19Ethereum Signed Message:\n`
                ethers.utils.joinSignature(wallet._signingKey().signDigest(signedTxHash)),
            ]);

            aaTx.customData = {
                ...aaTx.customData,
                customSignature: signature,
            };

            const sentTx = await provider.sendTransaction(utils.serialize(aaTx));
            await sentTx.wait();

            console.log(sentTx)
        }

    }

    return (
        <div className='flex items-center justify-center fixed h-full w-full backdrop-blur-sm z-10'>
            {
                showTokensList ? 
                <div className='flex items-center justify-center fixed w-full h-full backdrop-blur-md z-10'>
                    <div className='rounded-lg fixed w-[400px] h-[540px] bg-white p-4'>
                        <div className='flex w-full justify-end'>
                            <div className=''>
                                <button onClick={() => showSendToken(false)} className='bg-[#f1f5f9] rounded-full p-[6px]'><svg data-v-4d731bae="" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 3.5L3.5 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
                            </div>
                        </div>
                        <div className='font-semibold text-lg flex w-full justify-center border-b pb-2 mb-6'>Select a token</div>
                        {
                            ["USDC","USDT","DAI"].map(key => {
                                return(
                                    <div className='my-2'>
                                        <button onClick={() => {setShowTokensList(false); setCurrentToken(key);}} className="w-full px-2 flex items-center justify-center font-semibold rounded-lg h-[60px] bg-[#f1f5f9]"> 
                                            <div className='w-6 h-6 mx-1'><img src={tokensList[key].image}/></div>
                                            <div className='flex-1 flex justify-start' >{tokensList[key].symbol}</div>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 text-slate-400 -rotate-90"><path d="M15 8L10 13L5 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                        </button>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>  : <div></div>
            }
            <div className='rounded-lg w-[450px] h-4/6 bg-white p-6'>
                <div className='flex space-x-3'>
                    <div className='flex items-center'>
                        <div className='rounded-full p-3 bg-[#07A65D] text-white'>
                            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="-rotate-45 w-3.5 h-3.5"><path d="M4.16663 10H15.8333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 4.16669L15.8333 10L10 15.8334" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        </div>
                    </div>
                    <div className=''>
                        <div className='font-semibold'>Send</div>
                        <div className='text-xs text-[#94A3B8]'>Tranfer tokens to any address</div>
                    </div>
                    <div className='flex w-5/12 justify-end'>
                        <div className=''>
                            <button onClick={() => showSendToken(false)} className='bg-[#f1f5f9] rounded-full p-[6px]'><svg data-v-4d731bae="" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 3.5L3.5 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
                        </div>
                    </div>
                </div>
                <div className='w-full flex items-center h-[80px]'>
                    <div className='flex space-x-1 items-center font-semibold text-xs rounded-full border px-4 py-1 border-black'>
                        <div>Processing on the </div>
                        <div className='rounded-full p-1 border border-black'><svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.71429 4.16699L0 9.88128L5.71429 15.5956V11.3098L11.4286 7.02414H5.71429V4.16699Z"></path><path d="M20 9.88128L14.2857 4.16699V8.45271L8.57143 12.7384H14.2857V15.5956L20 9.88128Z"></path></svg></div>
                        <div>Zksync</div>
                    </div>
                </div>
                <div className="flex w-full h-[80px] space-x-6">
                    <div className="w-[120px] space-y-1">
                        <div className="text-sm">Token</div>
                        <button onClick={() => setShowTokensList(true)} className="w-full px-2 flex items-center justify-center font-semibold rounded-lg h-[45px] bg-[#f1f5f9]"> 
                            <div className='w-6 h-6 mx-1'><img src={tokensList[currentToken].image}/></div>
                            <div className='flex-1 flex justify-start' >{tokensList[currentToken].symbol}</div>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 text-slate-400 -rotate-90"><path d="M15 8L10 13L5 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        </button>
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="text-sm">Amount</div>
                        <input onChange={e => setReceiverAmount(e.target.value)} className="placeholder:text-slate-400 block bg-[#f1f5f9] w-full rounded-md py-3 pl-4 pr-3 shadow-sm focus:outline-none sm:text-sm" placeholder="Enter amount" type="number" name="search"/>
                    </div>
                </div>
                <div className="w-full space-y-2 my-4">
                    <div className="text-sm">Address</div>
                    <input onChange={e => setReceiverAddress(e.target.value)} className="placeholder:text-slate-400 block bg-[#f1f5f9] w-full rounded-md py-3 pl-4 pr-3 shadow-sm focus:outline-none sm:text-sm" placeholder="Enter Address" type="text" name="search"/>
                </div>
                <div className="flex items-center text-xs text-[#94A3B8] font-semibold">
                    <div className="text-[#07A65D]"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2.5 h-4 w-4 svg-gray-info rounded-full"><g clip-path="url(#info-2_svg__clip0_13856_490518)"><path d="M7 -6.11959e-07C3.13401 -9.49935e-07 9.49935e-07 3.13401 6.11959e-07 7C2.73984e-07 10.866 3.13401 14 7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 -2.73984e-07 7 -6.11959e-07Z" fill="currentColor"></path><path d="M7.00391 9.72217L7.00391 7.38883" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7.00391 4.27783L6.99391 4.27783" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="info-2_svg__clip0_13856_490518"><rect width="14" height="14" fill="white" transform="translate(14 14) rotate(-180)"></rect></clipPath></defs></svg></div>
                    <div>Sending token on</div>
                    <div className='text-black rounded-full p-1 border border-black mx-1'><svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.71429 4.16699L0 9.88128L5.71429 15.5956V11.3098L11.4286 7.02414H5.71429V4.16699Z"></path><path d="M20 9.88128L14.2857 4.16699V8.45271L8.57143 12.7384H14.2857V15.5956L20 9.88128Z"></path></svg></div>
                    <div>Zksync</div>
                </div>
                <button onClick={() => transferToken()} className="rounded-full w-full my-6 border py-2 text-white bg-[#07A65D]">Continue</button>
            </div>
        </div>
    )
}

export default SendFlap;