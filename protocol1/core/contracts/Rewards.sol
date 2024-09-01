// SPDX-License-Identifier: GPL-2.0-only
pragma solidity >=0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Rewards is ERC20 {
    address owner;
    mapping(address => mapping(address => uint256)) rewardsTimestamp;
    mapping(address => mapping(address => uint256)) totalRewards;
    mapping(address => mapping(address => uint256)) totalStaked;
    uint8 public constant MULTIPLICATION_FACTOR = 1;

    constructor() ERC20("Rewards", "RWD") {
        owner = msg.sender;
    }     

    function stakeToken(address token, uint256 amount) external {
        if(rewardsTimestamp[token][msg.sender] == 0) {
            rewardsTimestamp[token][msg.sender] = block.timestamp;
        } else {
            uint256 timeSpent = block.timestamp - rewardsTimestamp[token][msg.sender];
            if(timeSpent > 0) {
               totalRewards[token][msg.sender] += (timeSpent * MULTIPLICATION_FACTOR + totalStaked[token][msg.sender]);
            } 
            rewardsTimestamp[token][msg.sender] = block.timestamp;
        }
        totalStaked[token][msg.sender] += amount;
        IERC20(token).transferFrom(msg.sender, address(this), amount);
    }

    function unStakeToken(address token, uint256 amount) external {
        if(totalStaked[token][msg.sender] < amount) {
            revert("Insufficient balance");
        }

        if(rewardsTimestamp[token][msg.sender] > 0) {
            uint256 timeSpent = block.timestamp - rewardsTimestamp[token][msg.sender];
            if(timeSpent > 0) {
                totalRewards[token][msg.sender] += (timeSpent * MULTIPLICATION_FACTOR + totalStaked[token][msg.sender]);
            } 
        }

        rewardsTimestamp[token][msg.sender] = block.timestamp;
        totalStaked[token][msg.sender] -= amount;
        IERC20(token).transfer(msg.sender, amount);
    }

    function pendingReward(address token) external view returns (uint256) {
        if(rewardsTimestamp[token][msg.sender] > 0) {
            uint256 timeSpent = block.timestamp - rewardsTimestamp[token][msg.sender];
            if(timeSpent > 0) {
                return totalRewards[token][msg.sender] + (timeSpent * MULTIPLICATION_FACTOR + totalStaked[token][msg.sender]);
            } 
        }
        
        return totalRewards[token][msg.sender];
    }

    function claimRewards(address token, address receiver) external {
        if(rewardsTimestamp[token][msg.sender] > 0) {
            uint256 timeSpent = block.timestamp - rewardsTimestamp[token][msg.sender];
            if(timeSpent > 0) {
                totalRewards[token][msg.sender] += (timeSpent * MULTIPLICATION_FACTOR + totalStaked[token][msg.sender]);
            } 
            rewardsTimestamp[token][msg.sender] = block.timestamp;
        }

        if(totalRewards[token][msg.sender] > 0) {
            uint256 rewards = totalRewards[token][msg.sender];
            totalRewards[token][msg.sender] = 0;
            
            _mint(receiver, rewards);
        }
    }
}