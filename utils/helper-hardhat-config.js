const networkConfig = {
  11155111: {
    name: "sepolia",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
};

const developmentChains = [31337];
const developmentChainsNames = ["hardhat", "localhost"];

module.exports = { developmentChainsNames, networkConfig, developmentChains };
