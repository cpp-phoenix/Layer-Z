import { activeStrategies, tokenContract } from '../constants';
import { useAccount, useNetwork, useWalletClient} from 'wagmi'
import {ethers}  from "ethers";
import principalERC20ABI from '../principalERC20ABI.json';

function Faucet () {
    const {isConnected, address} = useAccount()
    const {chain} = useNetwork()
    const { data: signer } = useWalletClient();

    const mintToken = async (contractAddr) => {
        const provider = new ethers.JsonRpcProvider(tokenContract[chain.id].PROVIDER);

        const tokenContractAddr = new ethers.Contract(contractAddr, principalERC20ABI, provider);
        const signedTokenContractAddr = tokenContractAddr.connect(signer)
        try {
            await signedTokenContractAddr.mint(ethers.parseUnits("100","ether"));
        } catch (e) {

        }
    }
    
    return (
        <div className="text-white mt-2 rounded-r-[10px] w-[1403px] h-[944px] bg-black">
            {
                isConnected ?
                    <div>
                        <div className="flex flex-col justify-center items-center text-4xl h-[300px] space-y-4">
                            <div className='text-6xl'>Use Faucet to mint tokens to stake</div> 
                            <div>Each claim will give you 100 tokens</div>
                        </div>
                        <div className="flex items-center justify-center h-[400px]">
                            <div className='space-x-24'>
                                {
                                    activeStrategies[chain.id].map(token => {
                                        return (
                                            <button onClick={() => mintToken(token.address)} className='rounded-[10px] w-[160px] h-[80px] bg-[#FFD013] text-xl font-semibold'>Mint {token.token}</button>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                : ""
            }
        </div>
    )
}

export default Faucet;