const path = require("path");
const fs = require("fs-extra");
const Web3 = require("web3");
const Web3Quorum = require("web3js-quorum");

// WARNING: the keys here are demo purposes ONLY. Please use a tool like EthSigner for production, rather than hard coding private keys
const { tessera, besu, contractInformations } = require("./keys.js");

const host = besu.rpcnode.url;

const web3 = new Web3(host);
const account = web3.eth.accounts.privateKeyToAccount(
  besu.rpcnode.accountPrivateKey
);
const accountAddress = account.address;
const contractJsonPath = path.resolve(
  __dirname,
  "../",
  "contracts",
  "publicdata.json"
);

const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
const contractAbi = contractJson.abi;
const contractBytecode = contractJson.evm.bytecode.object;

const main = async (contractAddress, contractAbi) => {
  console.log("Using contract at address:", accountAddress);
  const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);
  const value = await contractInstance.methods
    .ismoe()
    .call({ from: accountAddress });
  console.log("Value from contract:", value);
  return value;
};
if (require.main === module) {
  main(contractInformations.publicdata.contractAddress, contractAbi);
}

module.exports = exports = main;
