import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import hre from 'hardhat';
import { networkConfig, developmentChains } from '../../helper-hardhat-config';
import MockV3Aggregator from './MockV3Aggregator';

const FundMe = buildModule('FundMe', (builder) => {
  const chainId = hre.network.config.chainId!;
  let ethUsdPriceFeedAddress;

  if (developmentChains.includes(hre.network.name)) {
    const { contract } = builder.useModule(MockV3Aggregator);
    ethUsdPriceFeedAddress = contract;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]?.ethUsdPriceFeed;
  }

  const priceConverterLib = builder.library('PriceConverter');
  const contract = builder.contract('FundMe', [ethUsdPriceFeedAddress!], {
    libraries: {
      PriceConverter: priceConverterLib,
    },
  });

  return { contract };
});

export default FundMe;
