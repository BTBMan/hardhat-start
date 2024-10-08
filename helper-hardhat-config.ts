export const networkConfig: Record<
  number,
  { name: string; ethUsdPriceFeed: string }
> = {
  11155111: {
    name: 'ethereum sepolia',
    ethUsdPriceFeed: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
  },
};

export const developmentChains = ['hardhat', 'local'];

export const DECIMALS = 8;
export const INITIAL_ANSWER = 200000000000;
