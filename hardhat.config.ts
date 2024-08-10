import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

task('accounts', 'Prints the list of accounts', async (_, hre) => {
  const signers = await hre.ethers.getSigners();

  for (const account of signers) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: '0.8.24',
};

export default config;
