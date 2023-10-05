import Navbar from "../components/Navbar.js";
import Walletbar from "../components/Walletbar.js";

function Dapps() {
    return (
        <div className="flex h-screen w-screen">
            <Navbar selected="Dapps"/>
            <div className="w-full">
                <Walletbar/>
                <div>

                </div>
            </div>
        </div>
    )
}

export default Dapps;