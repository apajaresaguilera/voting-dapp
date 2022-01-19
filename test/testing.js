const { expect } = require("chai");
const { ethers } = require("hardhat");

let votingContract;
let signers = [];

before(async () => {
  signers = await ethers.getSigners();
 
  console.log(signers[0].address);
  const Voting = await ethers.getContractFactory("Voting");
  votingContract = await Voting.deploy();

  await votingContract.deployed();
  console.log("Voting contract deployed to:", votingContract.address);
});


describe("Voting", function () {
  it("Should sign up a candidate", async function () {
    
    await votingContract.signUpAsCandidate("Jon", "Doe")
    const candidate = await votingContract.candidates(0);

    expect(candidate.candidateAddress).to.equal(signers[0].address);
    expect(candidate.name).to.equal('Jon');
    expect(candidate.surname).to.equal('Doe');

  });
  it("Should not allow an existing candidate to re-register in the system", async function () {
    
    await expect( votingContract.signUpAsCandidate("Jon", "Doe")).to.be.revertedWith("Candidate already exists!");
    
  });
  
  it("Should  allow anyone to start an election", async function () {
    
    await votingContract.startElection("klk", 2, 3, 5);
    const election = await votingContract.elections(0);

    
  });

  it("Should  allow a candidate to register for an election", async function () {
    
    await votingContract.registerToElection(0);
    
    let candidateAdded = await votingContract.candidateIsInElection(signers[0].address, 0);
    expect(candidateAdded).to.equal(true);
  });

  it("Should  allow a voter to vote for a candidate", async function () {
    
    await votingContract.connect(signers[1]).voteForCandidate(signers[0].address, 0);
    
    let candidateVotes = await votingContract.getCandidateVotes(signers[0].address, 0);
    expect(candidateVotes).to.equal(1);
  });

});
