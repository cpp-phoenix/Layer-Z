
import { useState, useEffect, useCallback } from 'react';
import { signClient } from './../utils/WalletConnectUtils'

function DisconnectDappFlap({showDisconnectDapp, pairData}) {

    const disconnectDapp = async () => {
        await signClient.core.pairing.disconnect({ topic: pairData.topic })
        showDisconnectDapp(false)
    }

    return (
        <div className='flex flex-col items-center justify-center fixed h-full w-full backdrop-blur-sm z-10'>
            <div className='rounded-[20px] bg-white p-2'>
                <div className='fixed flex w-[370px] justify-end'>
                    <div className=''>
                        <button onClick={() => showDisconnectDapp(false)} className='bg-[#f1f5f9] rounded-full p-[6px]'><svg data-v-4d731bae="" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 3.5L3.5 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
                    </div>
                </div>
                <div className='flex flex-col items-center rounded-[34px] w-[370px] h-3/6 p-6'>
                    <div className='w-12 h-12 border'><img src={pairData.peerMetadata.icons[0]}/></div>
                    <div className='font-semibold py-4'>{pairData.peerMetadata.name}</div>
                    <div className='text-center text-xs text-[#94A3B8]'>You need the Avocado web app to be open to initiate transactions. Please don't close the tab</div>
                    <div className='text-sm text-[#07A65D] font-semibold py-4'>{pairData.peerMetadata.url}</div> 
                    <button onClick={() => disconnectDapp()} className='rounded-[20px] text-white text-sm font-semibold py-3 w-full bg-[#EB5757]'>Disconnect</button>
                </div>
            </div>
        </div>
    )
}

export default DisconnectDappFlap;