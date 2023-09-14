const fs = require("fs");
const path = require("path");
const solc = require("solc");

const fileName = "Lottery.sol";
const contractName = "Lottery";

const contractPath = path.resolve(__dirname, "contracts", fileName);

const sourceCode = fs.readFileSync(contractPath, "utf8");

// solc compiler config
const input = {
  language: "Solidity",
  sources: {
    [fileName]: {
      content: sourceCode,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));

const bytecode =
  compiledCode.contracts[fileName][contractName].evm.bytecode.object;
const bytecodePath = path.join(__dirname, "data", "LotteryBytecode.bin");
fs.writeFileSync(bytecodePath, bytecode); 

const abi = compiledCode.contracts[fileName][contractName].abi;

const abiPath = path.join(__dirname, "data", "LotteryAbi.json");
fs.writeFileSync(abiPath, JSON.stringify(abi, null, "\t"));

module.exports = { bytecode, abi };
