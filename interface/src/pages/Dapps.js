import { useEffect, useState } from "react";
import { useAccount } from 'wagmi'
import Navbar from "../components/Navbar.js";
import Walletbar from "../components/Walletbar.js";

function Dapps() {
    const { isConnected } = useAccount()
    const [loggedin, setLoggedIn] = useState(false)

    useEffect(() => {
        if(isConnected) {
            (async () => {
                console.log("Testing")
            })();
        }
    },[isConnected])

    return (
        <div className="flex h-screen w-screen">
            <Navbar selected="Dapps" loggedin={loggedin}/>
            <div className="w-full">
                <Walletbar/>
                <div>

                </div>
            </div>
        </div>
    )
}

export default Dapps;