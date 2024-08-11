import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import hre from 'hardhat';
import FundMe from '../ignition/modules/FundMe';

describe('FundMe', () => {
  const deployFixture = async () => {
    const { contract } = await hre.ignition.deploy(FundMe);

    return { contract };
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
