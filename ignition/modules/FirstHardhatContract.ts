import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const FirstHardhatContractModule = buildModule(
  'FirstHardhatContractModule',
  (builder) => {
    const contract = builder.contract('FirstHardhatContract');

    const contractName = builder.staticCall(contract, 'getName', []);
    const triggerEvent = builder.call(contract, 'triggerEvent', []);

    const value = builder.readEventArgument(triggerEvent, 'MyEvent', 0);

    console.log(value);
    console.log(contractName);

    return { contract };
  },
);

export default FirstHardhatContractModule;
