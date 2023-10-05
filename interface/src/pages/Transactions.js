import Navbar from "../components/Navbar.js";
import Walletbar from "../components/Walletbar.js";

function Transactions() {
    return (
        <div className="flex h-screen w-screen">
            <Navbar selected="Transactions"/>
            <div className="w-full">
                <Walletbar/>
                <div>
                    
                </div>
            </div>
        </div>
    )
}

export default Transactions;