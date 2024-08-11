// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./PriceConverter.sol";

error NotOwner();

contract FundMe {
    using PriceConverter for uint256;

    // use constant to save gas fee
    uint256 public constant MINIMUM_USD = 5e18;

    // use immutable to save gas fee
    address public immutable i_owner;

    address[] public funders;

    mapping(address funder => uint256 amountFunded)
        public addressToAmountFunded;

    constructor() {
        i_owner = msg.sender; // save deployer
    }

    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Sender is not owner!");
        // do this way is gonna save gas fee
        if (msg.sender != i_owner) {
            revert NotOwner();
        }
        _;
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate() >= MINIMUM_USD,
            "Didn't send enough!"
        );

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }

        funders = new address[](0); // reset funders to brand new blank address array
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");

        require(callSuccess, "Call failed!");
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}
