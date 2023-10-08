// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

contract Messenger {

    string private message="Please send a message";
    
    constructor(){}

    function sendMessage(string calldata _message) public {
        message = _message;
    }

    function getMessage() public view returns(string memory) {
        return message;
    }
}