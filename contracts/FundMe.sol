// SPDX-License-Identifier: MIT
// pragma
pragma solidity ^0.8.4;
// imports
import "./PriceConverter.sol";
// import "hardhat/console.sol";

// error name is contract name plus __ plus name
error FundMe__NotOwner();

// interfaces
// libraries
// contracts
/**
 * @title A contract for crowd funding
 * @author BTBMan
 * @notice This contract is to demo a sample funding contract
 * @dev This implements price feeds as our library
 */
contract FundMe {
    // type declarations
    using PriceConverter for uint256;

    // state variable
    // variable that has prefix 's' means it is a storage variable
    address[] private s_funders;
    mapping(address funder => uint256 amountFunded)
        private s_addressToAmountFunded;
    address private s_priceFeedAddress;
    address public immutable i_owner; // use immutable to save gas fee
    uint256 public constant MINIMUM_USD = 5e18; // use constant to save gas fee

    // modifiers
    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Sender is not owner!");
        // do this way is gonna save gas fee
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    // functions
    // functions order
    // constructor
    // receive
    // fallback
    // external
    // public
    // internal
    // private
    // view / pure
    constructor(address _priceFeedAddress) {
        i_owner = msg.sender; // save deployer
        s_priceFeedAddress = _priceFeedAddress;

        // console.log("console in solidity: ", i_owner);
    }

    // receive() external payable {
    //     fund();
    // }

    // fallback() external payable {
    //     fund();
    // }

    /**
     * @notice fund function
     * @dev This implements price feeds as our library
     */
    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeedAddress) >= MINIMUM_USD,
            "Didn't send enough!"
        );

        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0); // reset funders to brand new blank address array
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");

        require(callSuccess, "Call failed!");
    }

    function cheaperWithdraw() public onlyOwner {
        address[] memory funders = s_funders;
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0); // reset funders to brand new blank address array
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");

        require(callSuccess, "Call failed!");
    }

    function getFunders(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(
        address funder
    ) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeedAddress() public view returns (address) {
        return s_priceFeedAddress;
    }
}
