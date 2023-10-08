
import { useState, useEffect, useCallback } from 'react';
import { signClient } from './../utils/WalletConnectUtils'

function ConnectDappFlap({showConnectDapp, abyssAddress}) {

    const [connectURL, setConnectURL] = useState("");

    const startPairing = async () => {
        console.log(connectURL)
        const output =  await signClient.core.pairing.pair({ uri:connectURL })
        console.log("Created Pair: ", output)
    }
    
    return (
        <div className='flex flex-col items-center justify-center fixed h-full w-full backdrop-blur-sm z-10'>
            <div className='rounded-[20px] bg-white p-2'>
                <div className='fixed flex w-[370px] justify-end'>
                    <div className=''>
                        <button onClick={() => showConnectDapp(false)} className='bg-[#f1f5f9] rounded-full p-[6px]'><svg data-v-4d731bae="" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 3.5L3.5 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
                    </div>
                </div>
                <div className='flex flex-col items-center rounded-[34px] w-[370px] h-3/6 p-6'>
                    <div className='py-4'><svg width="60" height="60" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20 0C31.0469 0 40 8.95312 40 20C40 31.0469 31.0469 40 20 40C8.95312 40 0 31.0469 0 20C0 8.95312 8.95312 0 20 0Z" fill="url(#paint0_radial_2802_2420)"></path><path d="M12.7109 15.4453C16.7344 11.5156 23.2656 11.5156 27.2891 15.4453L27.7734 15.9219C27.9766 16.1172 27.9766 16.4375 27.7734 16.6328L26.1172 18.25C26.0156 18.3516 25.8516 18.3516 25.75 18.25L25.0859 17.6016C22.2734 14.8594 17.7266 14.8594 14.9141 17.6016L14.2031 18.2969C14.1016 18.3984 13.9375 18.3984 13.8359 18.2969L12.1797 16.6797C11.9766 16.4844 11.9766 16.1641 12.1797 15.9687L12.7109 15.4453ZM30.7188 18.7891L32.1953 20.2266C32.3984 20.4219 32.3984 20.7422 32.1953 20.9375L25.5469 27.4297C25.3438 27.625 25.0156 27.625 24.8203 27.4297L20.1016 22.8203C20.0547 22.7734 19.9688 22.7734 19.9219 22.8203L15.2031 27.4297C15 27.625 14.6719 27.625 14.4766 27.4297L7.80469 20.9375C7.60156 20.7422 7.60156 20.4219 7.80469 20.2266L9.28125 18.7891C9.48437 18.5938 9.8125 18.5938 10.0078 18.7891L14.7266 23.3984C14.7734 23.4453 14.8594 23.4453 14.9062 23.3984L19.625 18.7891C19.8281 18.5938 20.1562 18.5938 20.3516 18.7891L25.0703 23.3984C25.1172 23.4453 25.2031 23.4453 25.25 23.3984L29.9688 18.7891C30.1875 18.5938 30.5156 18.5938 30.7188 18.7891Z" fill="white"></path><defs><radialGradient id="paint0_radial_2802_2420" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0.000123978 20.0006) scale(40)"><stop stop-color="#5D9DF6"></stop><stop offset="1" stop-color="#006FFF"></stop></radialGradient></defs></svg></div>
                    <div className='font-semibold py-2'>Connext with WalletConnect</div>
                    <div className='text-xs text-[#94A3B8]'>Do not close this window while connecting</div>
                    <div className='w-full py-6'>
                        <input onChange={e => setConnectURL(e.target.value)} className="placeholder:text-slate-400 block bg-[#f1f5f9] w-full rounded-[12px] py-3 pl-4 pr-3 shadow-sm focus:outline-none sm:text-sm" placeholder="QR code or link" type="string" name="search"/>
                    </div>
                    <button onClick={() => startPairing()} className='rounded-[20px] text-white text-sm font-semibold py-4 w-full bg-[#07A65D]'>Connect</button>
                </div>
            </div>
        </div>
    )
}

export default ConnectDappFlap;