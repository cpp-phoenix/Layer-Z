import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export default async function (hre: HardhatRuntimeEnvironment) {
  // Private key of the account used to deploy
  const wallet = new Wallet("0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110");
  const deployer = new Deployer(hre, wallet);
  const factoryArtifact = await deployer.loadArtifact("DevToken");

  let factory = await deployer.deploy(
    factoryArtifact,
    ["USDC","USDC", "0xa61464658AfeAf65CccaaFD3a512b69A83B77618"]
  );

  console.log(`USDC address: ${factory.address}`);


  factory = await deployer.deploy(
    factoryArtifact,
    ["USDT","USDT", "0xa61464658AfeAf65CccaaFD3a512b69A83B77618"]
  );

  console.log(`USDC address: ${factory.address}`);


  factory = await deployer.deploy(
    factoryArtifact,
    ["DAI","DAI", "0xa61464658AfeAf65CccaaFD3a512b69A83B77618"]
  );

  console.log(`DAI address: ${factory.address}`);
}
