import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLink as Link } from 'react-router-dom';

function Navbar () {
    return (
        <div className="flex items-center justify-between w-full h-20 text-white pt-2">
            <div className='rounded-r-[10px] flex items-center justify-between flex-1 bg-black pr-10 pl-4 h-20'>
                <Link className="flex flex-row items-center space-x-4" to='/'>
                    {/* <img src="https://seeklogo.com/images/S/Sony_Alpha-logo-3BA7DFA79B-seeklogo.com.png" className="w-14 h-14" alt=""/> */}
                    <div className="text-[#FFD013] font-semibold text-5xl" to='/'>Layer Z</div>
                </Link>
                <div className="space-x-96 text-2xl mr-16">
                    <Link className="font-semibold hover:border-b-4 border-white" to='/'>Yeild</Link>
                    {/* <Link className="font-semibold hover:border-b-4 border-white" to='/transfer'>Transfer</Link> */}
                    {/* <Link className="font-semibold hover:border-b-4 border-white" to='/transactions'>Transactions</Link> */}
                    <Link className="font-semibold hover:border-b-4 border-white" to='/faucet'>Faucet</Link>
                </div>
            </div>
            <div className="flex items-center justify-center rounded-l-[10px] bg-black w-96 ml-1 h-20">
                <ConnectButton chainStatus="icon" accountStatus="avatar"/>
            </div>
        </div>
    )
}

export default Navbar;