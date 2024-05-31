const { assert, expect } = require("chai");
const hre = require("hardhat");

describe("FundMe", function (){
    let fundMe
    let mockV3Aggregator
    let deployer

    const ethToSend = hre.ethers.parseEther("1")

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

    describe("fund", function() {

        it("Fails if you don't send enough ETH", async () => {
            expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!")
        })

        it("amount should be updated in contract and funders", async () => {
            await fundMe.fund({value: ethToSend})
            const contractAmount = await hre.ethers.provider.getBalance(fundMe.target)
            const response = await fundMe.addressToAmountFunded(deployer)
            const firstFunder = await fundMe.funders(0)

            assert.equal(contractAmount, ethToSend)
            assert.equal(response, ethToSend)
            assert.equal(deployer, firstFunder)
        })
    })

    describe("withdraw", function() {
        this.beforeEach(async () => {
            await fundMe.fund({value: ethToSend})
        })

        it("withdraws ETH from a single funder", async () => {
            // arrange
            const startingContractBalance = await hre.ethers.provider.getBalance(fundMe.target)
            const startingDeployerBalance = await hre.ethers.provider.getBalance(deployer)

            // act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait()
            const {gasUsed, gasPrice} = transactionReceipt


            const gasCost = gasUsed * gasPrice

            const endingContractBalance = await hre.ethers.provider.getBalance(fundMe.target)
            const endingDeployerBalance = await hre.ethers.provider.getBalance(deployer)

            // assert

            assert.equal(endingContractBalance, 0)
            assert.equal(startingContractBalance + startingDeployerBalance, endingDeployerBalance + gasCost)

        })
    })

})
