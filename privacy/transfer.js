const Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:20000"); // Or your Quorum node

const senderPrivateKey =
  "8bbbb1b345af56b560a5b20bd4b0ed1cd8cc9958a16262bc75118453cb546df7";
const senderAccount = web3.eth.accounts.privateKeyToAccount(senderPrivateKey);

const recipient = "0x533715a3E74a9627560C7192F31346a085A76C72";

async function sendFunds() {
  const nonce = await web3.eth.getTransactionCount(senderAccount.address);

  const tx = {
    to: recipient,
    value: web3.utils.toWei("10", "ether"), // Adjust amount
    gas: 21000,
    gasPrice: "0", // Use '0' for Quorum (no gas fees)
    nonce: nonce,
  };

  const signedTx = await senderAccount.signTransaction(tx);
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

  console.log("Transaction successful:", receipt);
}

sendFunds().catch(console.error);
