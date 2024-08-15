import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import hre from 'hardhat';
import FundMe from '../ignition/modules/FundMe';
import { Contract } from 'ethers';

describe('FundMe', () => {
  const sendValue = hre.ethers.parseEther('1');
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
        expect(await contract.s_priceFeedAddress()).to.equal(
          mockV3AggregatorContract.target,
        );
      }
    });
  });

  describe('fund', async () => {
    it("fails if you don't send enough ETH", async () => {
      const { contract } = await loadFixture(deployFixture);

      await expect(contract.fund()).to.be.revertedWith("Didn't send enough!");
    });

    it('update the amount funded data structure', async () => {
      const [deployer] = await hre.ethers.getSigners();
      const { contract } = await loadFixture(deployFixture);

      await contract.fund({ value: sendValue });

      const response = await contract.s_addressToAmountFunded(deployer);

      expect(response).to.equal(sendValue);
    });

    it('add funder to array of funders', async () => {
      const [deployer] = await hre.ethers.getSigners();
      const { contract } = await loadFixture(deployFixture);

      await contract.fund({ value: sendValue });

      const response = await contract.s_funders(0);

      expect(response).to.equal(deployer);
    });
  });

  describe('withdraw', () => {
    let contract: Contract;

    beforeEach(async function () {
      // we can save contract to context
      // this.contract = (await loadFixture(deployFixture)).contract;
      // await this.contract.fund({ value: sendValue });

      // or save to a variable
      contract = (await loadFixture(deployFixture)).contract;

      await contract.fund({ value: sendValue });
    });

    it('withdraw ETH from a single funder', async function () {
      const [deployer] = await hre.ethers.getSigners();
      const startingFundMeBalance = await hre.ethers.provider.getBalance(
        contract,
      );
      const startingDeployerBalance = await hre.ethers.provider.getBalance(
        deployer,
      );

      // act
      const response = await contract.withdraw();
      const responseReceipt = await response.wait(1);
      const gasCost = BigInt(
        responseReceipt.gasUsed * responseReceipt.gasPrice,
      );

      const endingFundMeBalance = await hre.ethers.provider.getBalance(
        contract,
      );
      const endingDeployerBalance = await hre.ethers.provider.getBalance(
        deployer,
      );

      expect(endingFundMeBalance).to.equal(0);
      expect(startingFundMeBalance + startingDeployerBalance).to.equal(
        endingDeployerBalance + gasCost,
      );
    });

    it('allow us to withdraw with multiple funders', async function () {
      const [deployer, ...accounts] = await hre.ethers.getSigners();
      for (let i = 0; i < 6; i++) {
        const account = accounts[i];
        const fundMeConnectedContract = await contract.connect(account);
        await (fundMeConnectedContract as any).fund({ value: sendValue });
      }

      const startingFundMeBalance = await hre.ethers.provider.getBalance(
        contract,
      );
      const startingDeployerBalance = await hre.ethers.provider.getBalance(
        deployer,
      );

      const response = await contract.withdraw();
      const responseReceipt = await response.wait(1);
      const gasCost = BigInt(
        responseReceipt.gasUsed * responseReceipt.gasPrice,
      );

      const endingFundMeBalance = await hre.ethers.provider.getBalance(
        contract,
      );
      const endingDeployerBalance = await hre.ethers.provider.getBalance(
        deployer,
      );

      expect(endingFundMeBalance).to.equal(0);
      expect(startingFundMeBalance + startingDeployerBalance).to.equal(
        endingDeployerBalance + gasCost,
      );

      await expect(contract.s_funders(0)).to.be.reverted;

      for (let i = 0; i < 6; i++) {
        const account = accounts[i];

        expect(await contract.s_addressToAmountFunded(account)).to.equal(0);
      }
    });

    it('only allows the owner to withdraw', async () => {
      const [_, other] = await hre.ethers.getSigners();
      const fundMeConnectedContract = await contract.connect(other);

      await expect(
        (fundMeConnectedContract as any).withdraw(),
      ).to.be.revertedWithCustomError(
        fundMeConnectedContract,
        'FundMe__NotOwner',
      );
    });
  });

  describe('cheaperWithdraw', () => {
    let contract: Contract;

    beforeEach(async function () {
      // we can save contract to context
      // this.contract = (await loadFixture(deployFixture)).contract;
      // await this.contract.fund({ value: sendValue });

      // or save to a variable
      contract = (await loadFixture(deployFixture)).contract;

      await contract.fund({ value: sendValue });
    });

    it('withdraw ETH from a single funder', async function () {
      const [deployer] = await hre.ethers.getSigners();
      const startingFundMeBalance = await hre.ethers.provider.getBalance(
        contract,
      );
      const startingDeployerBalance = await hre.ethers.provider.getBalance(
        deployer,
      );

      // act
      const response = await contract.cheaperWithdraw();
      const responseReceipt = await response.wait(1);
      const gasCost = BigInt(
        responseReceipt.gasUsed * responseReceipt.gasPrice,
      );

      const endingFundMeBalance = await hre.ethers.provider.getBalance(
        contract,
      );
      const endingDeployerBalance = await hre.ethers.provider.getBalance(
        deployer,
      );

      expect(endingFundMeBalance).to.equal(0);
      expect(startingFundMeBalance + startingDeployerBalance).to.equal(
        endingDeployerBalance + gasCost,
      );
    });

    it('allow us to withdraw with multiple funders', async function () {
      const [deployer, ...accounts] = await hre.ethers.getSigners();
      for (let i = 0; i < 6; i++) {
        const account = accounts[i];
        const fundMeConnectedContract = await contract.connect(account);
        await (fundMeConnectedContract as any).fund({ value: sendValue });
      }

      const startingFundMeBalance = await hre.ethers.provider.getBalance(
        contract,
      );
      const startingDeployerBalance = await hre.ethers.provider.getBalance(
        deployer,
      );

      const response = await contract.cheaperWithdraw();
      const responseReceipt = await response.wait(1);
      const gasCost = BigInt(
        responseReceipt.gasUsed * responseReceipt.gasPrice,
      );

      const endingFundMeBalance = await hre.ethers.provider.getBalance(
        contract,
      );
      const endingDeployerBalance = await hre.ethers.provider.getBalance(
        deployer,
      );

      expect(endingFundMeBalance).to.equal(0);
      expect(startingFundMeBalance + startingDeployerBalance).to.equal(
        endingDeployerBalance + gasCost,
      );

      await expect(contract.s_funders(0)).to.be.reverted;

      for (let i = 0; i < 6; i++) {
        const account = accounts[i];

        expect(await contract.s_addressToAmountFunded(account)).to.equal(0);
      }
    });

    it('only allows the owner to withdraw', async () => {
      const [_, other] = await hre.ethers.getSigners();
      const fundMeConnectedContract = await contract.connect(other);

      await expect(
        (fundMeConnectedContract as any).cheaperWithdraw(),
      ).to.be.revertedWithCustomError(
        fundMeConnectedContract,
        'FundMe__NotOwner',
      );
    });
  });
});
