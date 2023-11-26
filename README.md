# Seedify Voting Dapp Challanges
Challenge: Build a simple decentralized voting application using React.js with a smart contract already done

Description:
Your task is to build a simple decentralized voting application that allows users to cast their votes without the need for a central authority. A smart contract has already been created and deployed on a testnet. You will need to integrate this smart contract into your application and build the frontend and backend components.

Requirements:
1. The application should be built using React.js for the frontend.
2. The smart contract has already been created and deployed on sepolia network. You will need to integrate this contract into your application.
3. Users should be able to connect their wallets (MetaMask, for example) to the platform to cast their votes.
4. The application should display real-time voting results, including the number of votes for each candidate.
5. The application should have a dashboard for users to view their voting history and account balances.

Bonus:

1. Add support for multiple voting rounds.
2. Add listener function that saves the vote, wallet and selected candidate to a database (can be a backend implementation, firebase or lowdb)
   
   **Note: you need to change the smart contract to add Events**

Note: You are free to use any libraries or frameworks you see fit to complete the challenge.


## Voting Smart Contract

Polygon Mumbai Testnet : 0x6aF073Ee5De24D916e91358D7096F8B82acEe057

https://mumbai.polygonscan.com/tx/0x820908cfea9a559b6b01cf15518c548b587332326484bb34573c20bc8a10cdda

## Backend Implementation

I'm build listener function to save vote with backend implementation using Node.js Express
https://github.com/zexoverz/zexo-voting-backend
