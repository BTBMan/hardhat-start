import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const FirstHardhatContractModule = buildModule(
  'FirstHardhatContractModule',
  (builder) => {
    const contract = builder.contract('FirstHardhatContract');

    builder.staticCall(contract, 'getName', []);
    const triggerEvent = builder.call(contract, 'triggerEvent', []);

    builder.readEventArgument(triggerEvent, 'MyEvent', 0);

    return { contract };
  },
);

export default FirstHardhatContractModule;
