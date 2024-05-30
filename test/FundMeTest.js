const { assert } = require("chai");
const hre = require("hardhat");

describe("FundMe", function (){
    let fundMe
    let mockV3Aggregator
    let deployer

    this.beforeEach(async () => {
        deployer = (await hre.getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    describe("constructor", function () {
        it("sets the aggregator addresses correctly", async () => {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.target)
        })
    })
})