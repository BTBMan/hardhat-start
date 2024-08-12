import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import hre from 'hardhat';
import { networkConfig, developmentChains } from '../../helper-hardhat-config';
import MockV3Aggregator from './MockV3Aggregator';

const FundMe = buildModule('FundMe', (builder) => {
  const chainId = hre.network.config.chainId!;
  let ethUsdPriceFeedAddress;
  let mockV3AggregatorContract;

  if (developmentChains.includes(hre.network.name)) {
    mockV3AggregatorContract = builder.useModule(MockV3Aggregator).contract;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]?.ethUsdPriceFeed;
  }

  // deploy the lib which is imported by the contract, first.
  const priceConverterLib = builder.library('PriceConverter');
  const contract = builder.contract(
    'FundMe',
    [(ethUsdPriceFeedAddress || mockV3AggregatorContract)!],
    {
      libraries: {
        PriceConverter: priceConverterLib,
      },
    },
  );

  return {
    contract,
    ...(mockV3AggregatorContract ? { mockV3AggregatorContract } : {}),
  };
});

export default FundMe;
