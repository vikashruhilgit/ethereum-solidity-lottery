const fs = require("fs");
const path = require("path");
const solc = require("solc");

const filePath = path.resolve(__dirname, "contracts", "Lottery.sol");

const source = fs.readFileSync(filePath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "Lottery.solc": {
      content: source,
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

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Lottery.solc"
].Lottery;

module.exports = output;
