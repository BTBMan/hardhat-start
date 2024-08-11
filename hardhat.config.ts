import { HardhatUserConfig, task, vars } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import 'dotenv/config';

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COIN_MARKET_KEY = process.env.COIN_MARKET_KEY;

task('accounts', 'Prints the list of accounts', async (_, hre) => {
  const signers = await hre.ethers.getSigners();

  for (const account of signers) {
    console.log(account.address);
  }
});

task('print', 'Just test', async () => {
  console.log(SEPOLIA_RPC_URL, PRIVATE_KEY);
});

const config: HardhatUserConfig = {
  solidity: '0.8.24',
  defaultNetwork: 'hardhat',
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY!],
      chainId: 11155111, // ethereum sepolia testnet: 11155111, mainnet: 1
    },
    local: {
      url: 'http://127.0.0.1:8545/',
      chainId: 31337, // this is the default chainId of the hardhat network
    },
  },
  gasReporter: {
    enabled: true,
    outputFile: 'gas-report.txt',
    noColors: true,
    currency: 'USD',
    coinmarketcap: COIN_MARKET_KEY,
  },
};

export default config;
