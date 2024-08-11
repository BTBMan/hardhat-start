// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPirce(
        AggregatorV3Interface priceFeed
    ) public view returns (uint256) {
        // AggregatorV3Interface priceFeed = AggregatorV3Interface(
        //     // 这个地址是 sepolia testnet ethereum/USD 的地址, 被硬编码到代码里, 但在别的链上就会出问题 所以这里须要重构, 从外部传入这个变量
        //     0x694AA1769357215DE4FAC081bf1f309aDC325306
        // );
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        // 转换为 wei(18 个小数位), price 是 8 个, 再加 10 个小数位
        return uint256(answer * 1e10); // 类型转换为 uint256
    }

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) public view returns (uint256) {
        uint256 ethPrice = getPirce(priceFeed);
        uint256 ethAmountInUsd = (ethAmount * ethPrice) / 1e18; // 两个 18 位数相乘是 36 位, 除以 1e18 还原到原本的长度

        return ethAmountInUsd;
    }
}
