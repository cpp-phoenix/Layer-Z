// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DevToken is ERC20{
    constructor(string memory name, string memory symbol, address receiver) ERC20(name, symbol){
        _mint(receiver, 10000000000*10**18);
    }
}