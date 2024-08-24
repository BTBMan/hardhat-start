// import { ethers } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js';
import { ethers } from './ethers.min.js'; // for better autocomplete
import { abi, address } from './constants.js';

const connectBtn = document.getElementById('connect');
const fundBtn = document.getElementById('fund');

connectBtn.onclick = connect;
fundBtn.onclick = fund.bind(this, '2');

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

async function fund(ethAmount) {
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(); // current connected wallet
    const contract = new ethers.Contract(address, abi, signer);

    await contract.fund({ value: ethers.parseEther(ethAmount) });
  }
}
