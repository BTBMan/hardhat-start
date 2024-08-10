import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import hre from 'hardhat';

describe('FirstHardhatContract', () => {
  const deployFixture = async () => {
    // const signers = await hre.ethers.getSigners();

    // default signer is the first signer of the signers
    const factory = await hre.ethers.getContractFactory('FirstHardhatContract');
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

    it('should get the name of the contract', async () => {
      const { contract } = await loadFixture(deployFixture);

      expect(await contract.getName()).to.equal('FirstHardhatContract');
    });
  });
});
