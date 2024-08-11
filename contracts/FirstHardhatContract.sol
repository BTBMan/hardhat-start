// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FirstHardhatContract {
    constructor() {}

    event MyEvent(address sender);

    string public name = "FirstHardhatContract";

    function getName() public view returns (string memory) {
        return name;
    }

    function triggerEvent() public {
        emit MyEvent(msg.sender);
    }
}
