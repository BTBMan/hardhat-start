// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPirce() public view returns (uint256) {
        // 0x694AA1769357215DE4FAC081bf1f309aDC325306
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        // 转换为 wei(18 个小数位), price 是 8 个, 再加 10 个小数位
        return uint256(answer * 1e10); // 类型转换为 uint256
    }

    function getConversionRate(
        uint256 ethAmount
    ) public view returns (uint256) {
        uint256 ethPrice = getPirce();
        uint256 ethAmountInUsd = (ethAmount * ethPrice) / 1e18; // 两个 18 位数相乘是 36 位, 除以 1e18 还原到原本的长度

        return ethAmountInUsd;
    }
}
