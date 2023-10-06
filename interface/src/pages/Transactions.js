import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi'
import Navbar from "../components/Navbar.js";
import Walletbar from "../components/Walletbar.js";

function Transactions() {
    const { isConnected } = useAccount()
    const [loggedin, setLoggedIn] = useState(false)

    useEffect(() => {
        if(isConnected) {
            (async () => {
                console.log("Testing")
            })();
        }
    },[isConnected])

    useEffect(() => {

    },[])

    return (
        <div className="flex h-screen w-screen">
            <Navbar selected="Transactions" loggedin={loggedin}/>
            <div className="w-full">
                <Walletbar/>
                <div>
                    
                </div>
            </div>
        </div>
    )
}

export default Transactions;