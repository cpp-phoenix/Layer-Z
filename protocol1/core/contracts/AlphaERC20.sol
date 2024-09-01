// SPDX-License-Identifier: GPL-2.0-only
pragma solidity >=0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AlphaERC20 is ERC20 {
    constructor(
        uint256 _totalSupply
    ) ERC20("Alpha", "APH") {
        _mint(msg.sender, _totalSupply);
    }
}
