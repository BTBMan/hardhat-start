import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { DECIMALS, INITIAL_ANSWER } from '../../helper-hardhat-config';

const MockV3Aggregator = buildModule('MockV3Aggregator', (builder) => {
  const contract = builder.contract('MockV3Aggregator', [
    DECIMALS,
    INITIAL_ANSWER,
  ]);

  return { contract };
});
1;

export default MockV3Aggregator;
