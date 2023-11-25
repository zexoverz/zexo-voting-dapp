// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Voting {
    struct Candidate {
        string name;
        uint[] voteCounts; // Store vote count for each round
    }
    
    mapping(address => mapping(uint => bool)) public voters; // Mapping to track votes per round
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;
    uint public currentRound; // Track the current voting round
    address public owner; // Store contract owner's address

    event Voted(string candidateName, address voters, uint currentRound, uint timestamp);
    
    constructor() {
        owner = msg.sender; // Set the contract deployer as the owner
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
        startNewRound(); // Start with round 0
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can perform this action");
        _;
    }
    
    function addCandidate(string memory _name) private {
        candidates[candidatesCount] = Candidate(_name, new uint[](1)); // Initialize vote counts for round 0
        candidatesCount++;
    }
    
    function startNewRound() public onlyOwner {
        currentRound++;
        for (uint i = 0; i < candidatesCount; i++) {
            candidates[i].voteCounts.push(0); // Add a new element to voteCounts for the new round
        }
        resetVoters(); // Reset voters mapping for a new round
    }
    
    function resetVoters() private {
        for (uint i = 0; i < candidatesCount; i++) {
            for (uint j = 0; j <= currentRound; j++) {
                voters[msg.sender][j] = false; // Reset the voters mapping for all rounds
            }
        }
    }
    
    function vote(uint _candidateId) public {
        require(!voters[msg.sender][currentRound], "You have already voted in this round.");
        require(_candidateId < candidatesCount, "Invalid candidate ID.");
        
        voters[msg.sender][currentRound] = true;
        candidates[_candidateId].voteCounts[currentRound]++;

        emit Voted(candidates[_candidateId].name, msg.sender, currentRound, block.timestamp);
    }
    
    function getCandidateVoteCount(uint _candidateId, uint _round) public view returns (uint) {
        require(_candidateId < candidatesCount, "Invalid candidate ID.");
        require(_round <= currentRound, "Invalid round.");
        return candidates[_candidateId].voteCounts[_round];
    }
}