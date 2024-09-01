// SPDX-License-Identifier: GPL-2.0-only
pragma solidity >=0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract BaseERC20 is ERC20, ERC20Burnable {

    mapping(address => bool) owners;

    constructor(
        address initialOwner,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
        owners[initialOwner] = true;
    }

    function addOwner(address owner, bool update) external {
        require(owners[msg.sender], "not allowed to mint");
        owners[owner] = update;
    }

    function mint(address to, uint256 amount) external {
        require(owners[msg.sender], "not allowed to mint");
        _mint(to, amount);
    }
}