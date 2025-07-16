const path = require("path");
const fs = require("fs-extra");
const Web3 = require("web3");
const Web3Quorum = require("web3js-quorum");

// WARNING: the keys here are demo purposes ONLY. Please use a tool like EthSigner for production, rather than hard coding private keys
const { tessera, besu, contractInformations } = require("../keys.js");

const chainId = 1337;

const contractJsonPath = path.resolve(
  __dirname,
  "../../",
  "contracts",
  "registerStud.json"
);
const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
const contractBytecode = contractJson.evm.bytecode.object;
const contractAbi = contractJson.abi;

async function getValueAtAddress(
  clientUrl,
  nodeName = "node",
  address,
  contractAbi,
  fromPrivateKey,
  fromPublicKey,
  toPublicKey
) {
  const web3 = new Web3(clientUrl);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbi);
  // eslint-disable-next-line no-underscore-dangle
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "MOE";
  });
  const functionParams = {
    to: address,
    data: functionAbi.signature,
    privateKey: fromPrivateKey,
    privateFrom: fromPublicKey,
    privateFor: [toPublicKey],
  };
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  // console.log(`Transaction hash: ${transactionHash}`);
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );
  console.log(
    "" + nodeName + " value from deployed contract is: " + result.output
  );
  return result;
}

async function main() {
  await getValueAtAddress(
    besu.member1.url,
    "Member1",
    contractInformations.registerStud.contractAddress,
    contractAbi,
    besu.member1.accountPrivateKey,
    tessera.member1.publicKey,
    tessera.member3.publicKey
  );
}

if (require.main === module) {
  main();
}

module.exports = exports = main;
