const Web3 = require("web3");
const fs = require("fs");

// No provider needed just to create keys
const web3 = new Web3("http://127.0.0.1:20000");

// Create a new account
const account = web3.eth.accounts.create();

console.log("Address:", account.address);
console.log("Private Key:", account.privateKey);

// Save the key to a JSON keystore (with a password)
const password = "yourStrongPassword";
const keystore = web3.eth.accounts.encrypt(account.privateKey, password);

// Save to file
fs.writeFileSync("account.json", JSON.stringify(keystore));

console.log("Keystore saved to account.json");
