import { useAccount, useWalletClient, usePublicClient } from 'wagmi'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import messengerABI from './../messengerABI.json'


function Home() {

    const [message, setMessage] = useState();
    const [inputMsg, setInputMsg] = useState();
    const { address, isConnected } = useAccount()

    const { data: signer } = useWalletClient();
    const provider = usePublicClient();

    useEffect(() => {
        if(isConnected) {
            console.log("Address: ", address)
            setMessage("Testing")
        }
    }, [isConnected])

    const getMessager = async () => {
        const _provider = new ethers.JsonRpcProvider("http://127.0.0.1:8011");
        const gasContract = new ethers.Contract(process.env.REACT_APP_MESSAGER_CONTRACT, messengerABI, _provider);
        const data = await gasContract.getMessage();
        setMessage(data)
    }

    const sendMessage = () => {
        console.log("Value is: ", inputMsg)
    }

    return (
        <div className='h-5/6'>
        {
            isConnected ?
            <div className='flex items-center justify-center w-full h-5/6'>
              <div>
                <div className='flex flex-col items-center py-10 space-y-2'>
                  <div>{message}</div>
                  <button onClick={() => getMessager()}  className='rounded-[20px] bg-blue-500 text-white px-6 py-2'>Get Message</button>
                </div>
                <div className='flex flex-col items-center py-4 space-y-4'>
                    <input onChange={e => setInputMsg(e.target.value)} className="placeholder:text-slate-400 block bg-[#f1f5f9] w-full rounded-md py-3 pl-4 pr-3 shadow-sm focus:outline-none sm:text-sm" placeholder="Enter message" type="string" name="search"/>
                    <button onClick={() => sendMessage()} className='rounded-[20px] bg-blue-500 text-white px-6 py-2'>Send Message</button>
                </div>
              </div>
              <div>
  
              </div>
            </div> : <></>
        }
        </div>
    )

}

export default Home;