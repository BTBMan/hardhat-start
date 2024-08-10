// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FirstHardhatContract {
    constructor() {}

    string public name = "FirstHardhatContract";

    function getName() public view returns (string memory) {
        return name;
    }
}
