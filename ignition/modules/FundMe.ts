import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const FundMe = buildModule('FundMe', (builder) => {
  const priceConverterLib = builder.library('PriceConverter');
  const contract = builder.contract('FundMe', [], {
    libraries: {
      PriceConverter: priceConverterLib,
    },
  });

  return { contract };
});

export default FundMe;
