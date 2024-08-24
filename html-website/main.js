// import { ethers } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js';
import { ethers } from './ethers.min.js'; // for better autocomplete
import { abi, address } from './constants.js';

const connectBtn = document.getElementById('connect');
const fundBtn = document.getElementById('fund');
const withdrawBtn = document.getElementById('withdraw');
const getBalanceBtn = document.getElementById('get-balance');
const balanceValue = document.getElementById('balance-value');

connectBtn.onclick = connect;
fundBtn.onclick = fund;
withdrawBtn.onclick = withdraw;
getBalanceBtn.onclick = getBalance;

async function getBalance() {
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(address);

    balanceValue.innerText = ethers.formatEther(balance) + ' HETH';
  }
}

async function connect() {
  if (window.ethereum) {
    await window.ethereum.request({
      method: 'eth_requestAccounts',
      params: [],
    });
    connectBtn.innerHTML = 'Connected';
  } else {
    connectBtn.innerHTML = 'Please install metamask';
  }
}

async function fund() {
  if (window.ethereum) {
    const ethAmount = document.getElementById('eth-amount').value;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(); // current connected wallet
    const contract = new ethers.Contract(address, abi, signer);

    try {
      const transactionResponse = await contract.fund({
        value: ethers.parseEther(ethAmount),
      });
      await listenForTransactionMine(transactionResponse, provider);
      console.log('Done!!!');
    } catch (error) {
      console.log('reject!');
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  const transactionHash = transactionResponse.hash;
  console.log(`mining ${transactionHash}...`);

  return new Promise((resolve) => {
    provider.once(transactionHash, async (transactionReceipt) => {
      console.log(`transaction address: ${transactionReceipt.to}`);
      console.log(
        `completed with ${await transactionReceipt.confirmations()} confirmations`,
      );
      resolve();
    });
  });
}

async function withdraw() {
  if (window.ethereum) {
    const ethAmount = document.getElementById('eth-amount').value;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(); // current connected wallet
    const contract = new ethers.Contract(address, abi, signer);

    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
      console.log('Done!!!');
    } catch (error) {
      console.log('reject!');
    }
  }
}
