import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const FirstHardhatContractModule = buildModule(
  'FirstHardhatContractModule',
  (builder) => {
    const contract = builder.contract('FirstHardhatContract');

    return { contract };
  },
);

export default FirstHardhatContractModule;
