import { useEffect, useState } from 'react';
import { useAccount, useNetwork, useWalletClient } from 'wagmi'
import {ethers}  from "ethers";
import { activeStrategies, tokenContract } from '../constants';
import coreERC20ABI from "../coreERC20ABI.json";
import baseERC20ABI from "../baseERC20ABI.json";
import principalERC20ABI from "../principalERC20ABI.json";
import rewardsABI from "../rewardsABI.json";

function Balances () {
    const {isConnected, address} = useAccount()
    const {chain} = useNetwork()
    const { data: signer } = useWalletClient();

    const [alphaTokenBalance, setAplhaTokenBalance] = useState(0)
    const [peBalance, setPEBalance] = useState(0)
    const [usdcBalance, setUSDCBalance] = useState(0)
    const [rewardsBalance, setRewardsBalance] = useState(0)

    useEffect(() => {
        if(isConnected) {
            getBalances();
        }
    },[isConnected])

    const getBalances = async () => {
        const provider = new ethers.JsonRpcProvider(tokenContract[chain.id].PROVIDER);

        const alphaERC20Contract = new ethers.Contract(tokenContract[chain.id].ALPHA_TOKEN_CONTRACT, coreERC20ABI, provider);
        const _aphaTokenBalance = await alphaERC20Contract.balanceOf(address)

        const peERC20Contract = new ethers.Contract(tokenContract[chain.id].PE_TOKEN_CONTRACT, baseERC20ABI, provider);
        const _peTokenBalance = await peERC20Contract.balanceOf(address)

        const usdcERC20Contract = new ethers.Contract(tokenContract[chain.id].USDC_TOKEN_CONTRACT, principalERC20ABI, provider);
        const _usdcTokenBalance = await usdcERC20Contract.balanceOf(address)

        const rewardsERC20Contract = new ethers.Contract(tokenContract[chain.id].REWARDS_CONTRACT, rewardsABI, provider);
        const _rewardsTokenBalance = await rewardsERC20Contract.balanceOf(address)

        setAplhaTokenBalance(+parseFloat(ethers.formatEther(_aphaTokenBalance)).toFixed(3))
        setPEBalance(+parseFloat(ethers.formatEther(_peTokenBalance)).toFixed(3))
        setUSDCBalance(+parseFloat(ethers.formatEther(_usdcTokenBalance)).toFixed(3))
        setRewardsBalance(+parseFloat(ethers.formatEther(_rewardsTokenBalance)).toFixed(3))
    }

    return (
        <div className="text-white rounded-l-[10px] mt-2 w-96 bg-black h-[944px] overflow-y-scroll">
            { isConnected ?
                <div className="h-content">
                    <div className="flex flex-col items-between text-sm m-4 my-4 space-y-6 text-black">
                        <div className="rounded-lg border w-full bg-white text-xl px-2 py-3">Alpha Token Balance: {alphaTokenBalance} </div>
                        <div className="rounded-lg border w-full bg-white text-xl px-2 py-3">Portal Energy Token Balance: {peBalance}</div>
                        <div className="rounded-lg border w-full bg-white text-xl px-2 py-3">Wallet USDC Balance: {usdcBalance}</div>
                        <div className="rounded-lg border w-full bg-white text-xl px-2 py-3">Rewards Token Balance: {rewardsBalance}</div>
                        {/* <div className="rounded-lg border w-full h-66 bg-white py-2">
                            <div className='text-center text-2xl'>Total Deposited</div>
                            {
                                activeStrategies[chain.id].map(token => {
                                    return (
                                        <div className='text-lg'> 
                                            <div className='mx-2 mt-2'>{token["token"]}:</div>
                                            {
                                                token["strategies"].map(data => {
                                                    return (
                                                        <div className='mx-4'> 
                                                            {data["months"]} Months: 
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="rounded-lg border w-full h-66 bg-white py-2"> 
                            <div className='text-center text-2xl'>Available to withdraw</div>
                            {
                                activeStrategies[chain.id].map(token => {
                                    return (
                                        <div className='text-lg'> 
                                            <div className='mx-2 mt-2'>{token["token"]}:</div>
                                            {
                                                token["strategies"].map(data => {
                                                    return (
                                                        <div className='mx-4'> 
                                                            {data["months"]} Months: 
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div> */}
                    </div>
                </div> : ""
            }
        </div>
    )
}

export default Balances;