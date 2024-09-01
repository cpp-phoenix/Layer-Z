import { useAccount, useNetwork, useWalletClient} from 'wagmi'
import { useEffect, useState } from 'react';
import {ethers}  from "ethers";
import { activeStrategies, tokenContract } from '../constants';
import arrow from '../left-arrow.png';
import coreABI from '../coreABI.json';
import principalERC20ABI from '../principalERC20ABI.json';
import coreERC20ABI from '../coreERC20ABI.json';
import baseERC20ABI from '../baseERC20ABI.json';

function Yield () {
    const {isConnected, address} = useAccount()
    const {chain} = useNetwork()
    const [token, setToken] = useState("")
    const [tokenContractAdr, setTokenContractAdr] = useState("")
    const [months, setMonths] = useState(0)
    const [alphaCoreContract, setAlphaCoreContract] = useState()
    const [logo, setLogo] = useState("")
    const [tokenFrom, setTokenFrom] = useState("Portal Energy")
    const [tokenFromValue, setTokenFromValue] = useState(0)
    const [tokenTo, setTokenTo] = useState("Alpha Token")
    const [tokenToValue, setTokenToValue] = useState(0)

    const [alphaTokenFee, setAlphaTokenFee] = useState(0)
    const [totalRewards, setTotalRewards] = useState(0)
    const [totalStaked, setTotalStaked] = useState(0)
    const [myDeposit, setMyDeposit] = useState(0)
    const [availableToWdr, setAvailableToWdr] = useState(0)
    const [userPortalEnergy, setUserPortalEnergy] = useState(0)
    const [userPortalEnergyToken, setUserPortalEnergyToken] = useState(0)
    const [amountToStake, setAmountToStake] = useState(0)
    const [amountToUnstake, setAmountToUnstake] = useState(0)
    const [peAmountToMint, setpeAmountToMint] = useState(0)
    const [peAmountToBurn, setpeAmountToBurn] = useState(0)

    const { data: signer } = useWalletClient();

    useEffect(() => {
        if(isConnected) {

        }
    },[])

    useEffect(() => {
        if(months !== 0) {
            getBalances();   
        }
    }, [months])

    const getBalances = async () => {
        const provider = new ethers.JsonRpcProvider(tokenContract[chain.id].PROVIDER);

        const _alphaCoreContract = new ethers.Contract(alphaCoreContract, coreABI, provider);
        
        const _totalStaked = await _alphaCoreContract.totalPrincipalStaked();
        const _userUpdate = await _alphaCoreContract.getUpdateAccount(address, 0);

        const _rewards = await _alphaCoreContract.getPendingRewards()

        const _rewardsFee = await _alphaCoreContract.AMOUNT_TO_CONVERT()

        const peERC20Contract = new ethers.Contract(tokenContract[chain.id].PE_TOKEN_CONTRACT, baseERC20ABI, provider);
        const _peTokenBalance = await peERC20Contract.balanceOf(address)
        
        setTotalStaked(+parseFloat(ethers.formatEther(_totalStaked)).toFixed(3));
        setMyDeposit(+parseFloat(ethers.formatEther(_userUpdate[3])).toFixed(3));
        setAvailableToWdr(+parseFloat(ethers.formatEther(_userUpdate[6])).toFixed(3));
        setUserPortalEnergy(+parseFloat(ethers.formatEther(_userUpdate[5])).toFixed(5));
        setTotalRewards(+parseFloat(ethers.formatEther(_rewards)).toFixed(3));
        setAlphaTokenFee(+parseFloat(ethers.formatEther(_rewardsFee)).toFixed(3));
        setUserPortalEnergyToken(+parseFloat(ethers.formatEther(_peTokenBalance)).toFixed(5))
    }

    const stakeAmount = async () => {
        const provider = new ethers.JsonRpcProvider(tokenContract[chain.id].PROVIDER);

        const _alphaCoreContract = new ethers.Contract(alphaCoreContract, coreABI, provider);
        const _alphaCoreSigner = _alphaCoreContract.connect(signer)

        const tokenContractAddr = new ethers.Contract(tokenContractAdr, principalERC20ABI, provider);
        const signedTokenContractAddr = tokenContractAddr.connect(signer)
        
        const contractAllowance = await tokenContractAddr.allowance(address, alphaCoreContract)
        const walletBalance = await tokenContractAddr.balanceOf(address)

        if(amountToStake <= walletBalance) {
            try{
                if (contractAllowance < amountToStake) {
                    await signedTokenContractAddr.approve(alphaCoreContract, ethers.parseUnits(amountToStake,"ether"))
                }
                await _alphaCoreSigner.stake(ethers.parseUnits(amountToStake,"ether"))
            } catch (e) {
    
            }
        }
    }

    const unstakeAmount = async () => {
        if(amountToUnstake <= availableToWdr) {
            const provider = new ethers.JsonRpcProvider(tokenContract[chain.id].PROVIDER);

            const _alphaCoreContract = new ethers.Contract(alphaCoreContract, coreABI, provider);
            const _alphaCoreSigner = _alphaCoreContract.connect(signer)

            try{
                await _alphaCoreSigner.unstake(ethers.parseUnits(amountToUnstake,"ether"))
            } catch (e) {

            }
        }
    }

    const mintPE = async () => {
        if(peAmountToMint <= userPortalEnergy) {
            const provider = new ethers.JsonRpcProvider(tokenContract[chain.id].PROVIDER);

            const _alphaCoreContract = new ethers.Contract(alphaCoreContract, coreABI, provider);
            const _alphaCoreSigner = _alphaCoreContract.connect(signer)

            try {
                await _alphaCoreSigner.mintPortalEnergyToken(address, ethers.parseUnits(peAmountToMint,"ether"))
            } catch (e) {

            }
        }
    }

    const burnPE = async () => {
        if(peAmountToBurn <= userPortalEnergyToken) {
            const provider = new ethers.JsonRpcProvider(tokenContract[chain.id].PROVIDER);

            const peERC20Contract = new ethers.Contract(tokenContract[chain.id].PE_TOKEN_CONTRACT, baseERC20ABI, provider);
            const _peTokenallowance = await peERC20Contract.allowance(address, alphaCoreContract)
            
            if(_peTokenallowance < ethers.parseUnits(peAmountToBurn,"ether")) {
                await peERC20Contract.connect(signer).approve(alphaCoreContract, ethers.parseUnits(peAmountToBurn,"ether"))
            }

            const _alphaCoreContract = new ethers.Contract(alphaCoreContract, coreABI, provider);
            const _alphaCoreSigner = _alphaCoreContract.connect(signer)

            try {
                await _alphaCoreSigner.burnPortalEnergyToken(address, ethers.parseUnits(peAmountToBurn,"ether"))
            } catch (e) {

            }
        }
    }

    const claimRewards = async () => {
        const provider = new ethers.JsonRpcProvider(tokenContract[chain.id].PROVIDER);

        const tokenContractAddr = new ethers.Contract(tokenContract[chain.id].ALPHA_TOKEN_CONTRACT, coreERC20ABI, provider);
        const signedTokenContractAddr = tokenContractAddr.connect(signer)

        const _userBalance =  await tokenContractAddr.balanceOf(address) 
        try {
            if(_userBalance >= ethers.parseUnits("10","ether")) {
                const _alphaCoreContract = new ethers.Contract(alphaCoreContract, coreABI, provider);
                const _alphaCoreSigner = _alphaCoreContract.connect(signer)

                const _userAllowance = await tokenContractAddr.allowance(address, alphaCoreContract)
                if(_userAllowance < ethers.parseUnits("10","ether")) {
                    await signedTokenContractAddr.approve(alphaCoreContract, ethers.parseUnits("10","ether"))
                }

                await _alphaCoreSigner.convert()
            }
        } catch (e) {

        }

    }

    const estimateTokenConversion = async (val)  => {
        if(val > 0){
            const provider = new ethers.JsonRpcProvider(tokenContract[chain.id].PROVIDER);
            const _alphaCoreContract = new ethers.Contract(alphaCoreContract, coreABI, provider);
            let estimate = 0
            if(tokenFrom === "Alpha Token") {
                estimate = await _alphaCoreContract.quoteBuyPortalEnergy(ethers.parseUnits(val,"ether"))
            } else {
                estimate = await _alphaCoreContract.quoteSellPortalEnergy(ethers.parseUnits(val,"ether"))
            }

            setTokenFromValue(val)
            setTokenToValue(+parseFloat(ethers.formatEther(estimate)).toFixed(5))
        } else {
            setTokenToValue(0)
            setTokenFromValue(0)
        }
    }

    const convertToken = async () => {
        const provider = new ethers.JsonRpcProvider(tokenContract[chain.id].PROVIDER);
        const _alphaCoreContract = new ethers.Contract(alphaCoreContract, coreABI, provider);
        const _alphaCoreSigner = _alphaCoreContract.connect(signer)

        if(tokenFromValue > 0) {
            try {
                if(tokenFrom === "Alpha Token") {
                    const tokenContractAddr = new ethers.Contract(tokenContract[chain.id].ALPHA_TOKEN_CONTRACT, coreERC20ABI, provider);
                    const signedTokenContractAddr = tokenContractAddr.connect(signer)
    
                    const _userBalance =  await tokenContractAddr.balanceOf(address) 
    
                    if(_userBalance >= ethers.parseUnits(tokenFromValue,"ether")) {
                        const _userAllowance = await tokenContractAddr.allowance(address, alphaCoreContract)
                        if(_userAllowance < ethers.parseUnits(tokenFromValue,"ether")) {
                            await signedTokenContractAddr.approve(alphaCoreContract, ethers.parseUnits(tokenFromValue,"ether"))
                        }
                    }
                    await _alphaCoreSigner.buyPortalEnergy(ethers.parseUnits(tokenFromValue,"ether"), 0);
                } else {
                    if( userPortalEnergy >= tokenFromValue) {
                        await _alphaCoreSigner.sellPortalEnergy(ethers.parseUnits(tokenFromValue,"ether"), 0);
                    }
                }
            } catch (e) {
                 
            }
        }
    }

    return (
        <div className="text-white mt-2 rounded-r-[10px] w-[1403px] h-[944px] bg-black overflow-y-scroll">
            { isConnected ? months === 0 ?
                <div>
                    <div className='text-center text-5xl mt-16 h-32'>Get Instant Yield Upfront</div>
                    <div className='text-black bg-[#FFD013] font-semibold text-center border-y border-black text-3xl py-4'>Strategies</div>
                    {
                        activeStrategies[chain.id].map(token => {
                            return (
                                <div className='grid grid-cols-4'> 
                                    {
                                        token["strategies"].map(data => {
                                            return (
                                                <div onClick={() => {setMonths(data.months); setTokenContractAdr(token.address); setToken(token["token"]); setAlphaCoreContract(data.ALPHA_CORE_CONTRACT); setLogo(token.logo)}} className='cursor-pointer flex flex-col text-lg items-center justify-center rounded-lg bg-[#FFD013] mt-6 mx-4 w-[300px] h-60'>
                                                    <img src={token["logo"]} className="w-20 h-20 mb-4" alt=""/>
                                                    <div className='text-black text-xl'>Token Pool: {token["token"]}</div>
                                                    <div className='text-black text-xl'>Tenure: {data.months} Months</div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div> : 
                <div className='w-full'>
                    <div className='m-6 cursor-pointer w-14' onClick={() => setMonths(0)}> 
                        <img src={arrow} className="rounded-full p-3 w-12 h-12 bg-[#FFD013]"/>
                    </div>
                    <div className='w-full flex flex-row justify-between'>
                        <div className='flex items-center justify-center h-[750px] w-[640px]'>
                            <div className='flex flex-col items-center space-y-1'>
                                    <img src={logo} className="w-40 h-40 my-2" alt=""/>
                                    <div className='text-xl'>Token Pool: {token}</div>
                                    <div className='text-xl'>Tenure: {months} Months</div>
                                    <div className='text-xl pb-2'>Total Staked: {totalStaked}</div>
                                    <div className='border-t-2 border-[#FFD013] p-2'> 
                                        <div className='flex justify-center space-x-16'>
                                            <div className='text-xl py-2'> Rewards: {totalRewards} </div>
                                            <button onClick={() => claimRewards()} className='rounded-lg bg-[#FFD013] font-semibold px-3'>CLAIM</button>
                                        </div>
                                        <div className='text-sm pb-2 pt-1'>Disclamer: Users will have to pay a flat fee of {alphaTokenFee} Alpha tokens to claim rewards</div>
                                    </div>
                                    <div className='pt-4 border-[#FFD013] border-t-2 p-4'>
                                        <div className='flex flex-col text-md text-end items-end'>
                                            <div className='flex my-1'>
                                                <input onChange={(e) => {setAmountToStake(e.target.value)}} type="number" placeholder={`Enter ${token} to stake`} className='rounded-lg pl-2 text-black w-[280px] py-3 px-4 text-md'/>
                                                <button onClick={() => stakeAmount()} className='rounded-lg bg-[#FFD013] text-white w-24 ml-4 text-lg font-semibold'>Stake</button>
                                            </div>
                                            <div>My Stake: {myDeposit}</div>
                                            <div className='flex my-1 mt-4'>
                                                <input onChange={(e) => {setAmountToUnstake(e.target.value)}} type="number" placeholder={`Enter ${token} to unstake`} className='rounded-lg pl-2 text-black w-[280px] py-3 px-4 text-md'/>
                                                <button onClick={() => unstakeAmount()} className='rounded-lg bg-[#FFD013] text-white w-24 ml-4 text-lg font-semibold'>Unstake</button>
                                            </div>
                                            <div>Available To Withdraw: {availableToWdr}</div>
                                        </div> 
                                    </div>
                                    <div className='pt-4 border-[#FFD013] border-t-2 p-4'>
                                        <div className='flex flex-col text-md text-end items-end'>
                                            <div className='flex my-1 mt-4'>
                                                <input onChange={(e) => {setpeAmountToMint(e.target.value)}} type="number" placeholder={`Enter Portal Energy to mint`} className='rounded-lg pl-2 text-black w-[280px] py-3 px-4 text-md'/>
                                                <button onClick={() => mintPE()} className='rounded-lg bg-[#FFD013] text-white w-32 ml-4 text-lg font-semibold'>Mint Energy</button>
                                            </div>
                                            <div>Available Portal Energy: {userPortalEnergy}</div>
                                        </div>      
                                        <div className='flex flex-col text-md text-end items-end'>
                                            <div className='flex my-1 mt-4'>
                                                <input onChange={(e) => {setpeAmountToBurn(e.target.value)}} type="number" placeholder={`Enter Portal Energy to burn`} className='rounded-lg pl-2 text-black w-[280px] py-3 px-4 text-md'/>
                                                <button onClick={() => burnPE()} className='rounded-lg bg-[#FFD013] text-white w-32 ml-4 text-lg font-semibold'>Burn Energy</button>
                                            </div>
                                            <div>Available Portal Energy Token: {userPortalEnergyToken}</div>
                                        </div>   
                                    </div>
                            </div>
                        </div>
                        <div className='h-[710px] w-[640px]'>
                            <div className='flex items-center justify-center h-full'>
                                <div className='flex flex-col items-center justify-center rounded-lg bg-[#FFD013] w-[520px] h-[600px] space-y-8'>
                                    <div className='text-4xl mb-8 font-semibold'>Buy/Sell Portal Energy</div>
                                    <div className='space-y-2'>
                                        <div onClick={() => {
                                            setTokenFromValue(0)
                                            setTokenToValue(0)
                                            if(tokenFrom === "Alpha Token") {
                                                setTokenFrom("Portal Energy")
                                                setTokenTo("Alpha Token") 
                                            } else {
                                                setTokenTo("Portal Energy")
                                                setTokenFrom("Alpha Token") 
                                            }
                                        }} className='cursor-pointer rounded-lg w-[400px] bg-black py-3 px-4 text-xl'>{tokenFrom}</div>
                                        { tokenFrom === "Portal Energy" ? <div className='text-end text-sm'>Balance: {userPortalEnergy}</div> : ''}
                                        <input onChange={(e) => estimateTokenConversion(e.target.value)} type="number" placeholder='Enter amount' className='rounded-lg pl-2 text-black w-[400px] py-3 px-4 text-xl'/>
                                    </div>

                                    <div className='text-2xl'> To </div>
                                    
                                    <div className='space-y-2'>
                                        <div className='rounded-lg w-[400px] bg-black py-3 px-4 text-xl'>{tokenTo}</div>
                                        { tokenFrom !== "Portal Energy" ? <div className='text-end text-sm'>Balance: {userPortalEnergy}</div> : ''}
                                        <input disabled type="number" value={`${tokenToValue}`} className='rounded-lg pl-2 text-black w-[400px] py-3 px-4 text-xl'/>
                                    </div>
                                    <button onClick={() => convertToken()} className='rounded-lg bg-black py-4 px-8 text-2xl'> Convert </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> : ""
            }
        </div>
    )
}

export default Yield;