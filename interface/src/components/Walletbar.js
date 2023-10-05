import { ConnectButton } from '@rainbow-me/rainbowkit';

function Walletbar() {

    return(
        <div className="flex justify-center w-full">
            <div className="flex justify-end w-full py-6 mx-10">
                <ConnectButton showBalance={false} />
            </div>
        </div>
    )
}

export default Walletbar;