import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import hre from 'hardhat';
import FundMe from '../ignition/modules/FundMe';

describe('FundMe', () => {
  const deployFixture = async () => {
    const { contract, mockV3AggregatorContract } = await hre.ignition.deploy(
      FundMe,
    );

    return { contract, mockV3AggregatorContract };
  };

  describe('constructor', async () => {
    it('sets the aggregator addresses correctly', async () => {
      const { contract, mockV3AggregatorContract } = await loadFixture(
        deployFixture,
      );

      if (mockV3AggregatorContract) {
        expect(await contract.priceFeedAddress()).to.equal(
          mockV3AggregatorContract.target,
        );
      }
    });
  });
});
