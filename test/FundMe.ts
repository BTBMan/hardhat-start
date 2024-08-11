import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import hre from 'hardhat';

describe('FundMe', () => {
  const deployFixture = async () => {
    // deploy the lib which is imported by the contract, first.
    const priceConverterLibFactory = await hre.ethers.getContractFactory(
      'PriceConverter',
    );
    const priceConverterLib = await priceConverterLibFactory.deploy();

    const factory = await hre.ethers.getContractFactory('FundMe', {
      libraries: {
        PriceConverter: priceConverterLib,
      },
    });
    const contract = await factory.deploy();

    return { factory, contract };
  };

  describe('Deployment', () => {
    it('just console test', async () => {
      await loadFixture(deployFixture);
    });

    it('should deploy contract successfully', async () => {
      await loadFixture(deployFixture);

      expect(true).to.equal(true);
    });

    it('should get the MINIMUM_USD', async () => {
      const { contract } = await loadFixture(deployFixture);

      expect(await contract.MINIMUM_USD()).to.equal(BigInt(5e18));
    });
  });
});
