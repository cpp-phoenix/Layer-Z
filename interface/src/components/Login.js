import { useEffect } from "react";
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { HashZero } from '@ethersproject/constants';
import { Web3Storage } from 'web3.storage';
import { usePublicClient } from 'wagmi'
import multisigABI from "./../multisigABI.json";
import { utils, Wallet, Provider, EIP712Signer, types } from "zksync-web3";
import factoryABI from "./../factoryABI.json";
import nftABI from "./../nftABI.json";

function getAccessToken () {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDIxQzc5Qjk4ZTE1ODIwNWEwNzMzMzM1NzEyZWIwMDRiRjhhN0Q0QzciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjE2MzE4MDAxOTgsIm5hbWUiOiJTY2F0dGVyIn0.H0D97M3xr4g3eP7tn_8URf31vQYz5KrBT2NjB8gZB24";
}

function makeStorageClient () {
    return new Web3Storage({ token: getAccessToken() })
}

async function storeFiles(files) {
    const client = makeStorageClient()
    const cid = await client.put(files)
    return cid
}

function Login({setLoggedIn}) {
    const { address, isConnected } = useAccount()

    const uploadToIPFS = async (myJSON) => {
        const blob = new Blob([JSON.stringify(myJSON)], { type: 'application/json' })

        const files = [
            new File([blob], address + '.json')
        ]
        let ipfsLink = await storeFiles(files);
        const url = "https://" + ipfsLink + ".ipfs.w3s.link/" + address + ".json"
        console.log("URL is: " + url)
        return url
    }

    const deploySmartAccount = async () => {

        setLoggedIn(true)

        const provider = new Provider("http://127.0.0.1:8011");
        
        // Private key of the account used to deploy
        const wallet = new ethers.Wallet(process.env.REACT_APP_DEPLOYER_PRIVATE_KEY).connect(provider);
      
        const aaFactory = new ethers.Contract(
          process.env.REACT_APP_FACTORY_ADDRESS,
          factoryABI,
          wallet,
        );
      
        // For the simplicity of the tutorial, we will use zero hash as salt
        const salt = HashZero;

        // deploy account owned by owner1 & owner2
        let tx = await aaFactory.deployAccount(
          salt,
          address
        );
        await tx.wait();

        // Getting the address of the deployed contract account
        const abiCoder = new ethers.utils.AbiCoder();
        const multisigAddress = utils.create2Address(
            process.env.REACT_APP_FACTORY_ADDRESS,
            await aaFactory.aaBytecodeHash(),
            salt,
            abiCoder.encode(["address"], [address]),
        );
        console.log(`Multisig account deployed on address ${multisigAddress}`);

        const nftFactory = new ethers.Contract(
            process.env.REACT_APP_NFT_CREATOR_CONTRACT,
            nftABI,
            wallet,
        );

        const jsonData = { 
            "image": process.env.REACT_APP_BASE_AVATAR_URL,
            "multiSig": multisigAddress, 
            "owner": address 
        };

        let ifpsLink = await uploadToIPFS(jsonData)

        tx = await nftFactory.safeMint(address, ifpsLink)

    }

    return (
        <div className="flex items-center justify-center border h-5/6">
            <button onClick={() => deploySmartAccount()} className="rounded-lg border px-6 py-3 text-white bg-[#07A65D] font-semibold">Login</button>
        </div>
    )
}




export default Login;