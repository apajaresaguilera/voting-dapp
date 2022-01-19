//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
contract Voting { 
    
    using Counters for Counters.Counter;

    Counters.Counter private _electionCounter;

    struct Election {
        string electionName;
        uint electionStart;
        uint registrationPeriod;
        uint votingPeriod;
        uint endingTime;
    }

    struct Candidate {
        address candidateAddress;
        string name;
        string surname;
    }

    mapping(address => mapping(uint => bool))  candidateInElection;
    mapping(address => bool) candidateExists;
    mapping(address => mapping(uint => uint)) candidateVotes;
    mapping(address => mapping(uint => bool)) voter;
    Candidate[] public candidates;

    mapping(uint => Election) public elections;
    mapping(uint => bool) electionExists;

    

    constructor() {
       
    }

    modifier candidateSignedUp(address addressToCheck, bool needItSignedUp) {
        if(needItSignedUp){
             require(candidateExists[addressToCheck], "Sign up as a candidate first!");
        }else{
             require(!candidateExists[addressToCheck], "Candidate already exists!");
            
        }
       
        _;
    }

    function signUpAsCandidate(string memory name, string memory surname) public candidateSignedUp(msg.sender, false){
        candidates.push(Candidate(msg.sender, name, surname));
        candidateExists[msg.sender] = true;
    }
    function candidateIsInElection(address candidateAddress, uint electionId) public view returns(bool) {
        return candidateInElection[candidateAddress][electionId];
    }
    function startElection(string memory electionName, uint registrationPeriod, uint votingPeriod, uint endingTime) public {
        elections[_electionCounter.current()] =  Election(electionName, block.timestamp,registrationPeriod, votingPeriod, endingTime);
        electionExists[_electionCounter.current()] = true;
        _electionCounter.increment();
    }
    
    function registerToElection(uint electionId) public candidateSignedUp(msg.sender, true){
        require(electionExists[electionId], "Election doesn't exist!");
        require(block.timestamp < (elections[electionId].electionStart + elections[electionId].registrationPeriod) , "The registration period for this election is closed!");
        require(!candidateInElection[msg.sender][electionId], "Candidate already registered for this election!");
        candidateInElection[msg.sender][electionId] = true;
    }

    function voteForCandidate(address candidateAddress, uint electionId) public candidateSignedUp(candidateAddress, true){
        require(block.timestamp < ((elections[electionId].electionStart + elections[electionId].registrationPeriod)+ elections[electionId].votingPeriod), "The voting period for this election is closed!");
        require(!voter[msg.sender][electionId], "You already voted for this election!");
        require(candidateInElection[candidateAddress][electionId], "This candidate is not registered for this election!");
        candidateVotes[candidateAddress][electionId]++;
        voter[msg.sender][electionId] = true;
    }
    function getCandidateVotes(address candidateAddress, uint electionId) public view returns(uint){
        return candidateVotes[candidateAddress][electionId];
    }
}
