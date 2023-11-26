import { useEffect, useState } from 'react'
import zexoLogo from '/zexo.png'
import './App.css'
import {Box, Button, Divider, Grid, Typography, Card, CardActions, CardContent, CardMedia} from '@mui/material';
import pancake1 from '/pancake1.png'
import pancake2 from '/pancake2.png'
import TransactionHistory from './components/TransactionHistory'
import toast, { Toaster } from 'react-hot-toast';
import { ethers } from "ethers";
import { useAccount, useConnect, useContractRead, useContractReads, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { BACKEND_URL, VOTING_ABI, VOTING_ADDRESS } from './constant'
import { readContracts, readContract, prepareWriteContract, writeContract, waitForTransaction } from '@wagmi/core'
import axios from 'axios';

const votingContract = {
  address: VOTING_ADDRESS,
  abi: VOTING_ABI,
}

function App() {
  const { isConnected, address, connector: activeConnector } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const [ candidates, setCandidates] = useState([])
  const [ voteHistory, setVoteHistory] = useState([])
  const {data, error} = useContractReads({
    contracts: [
      {
        ...votingContract,
        functionName: 'currentRound',
      },
      {
        ...votingContract,
        functionName: 'owner',
      },
    ],
    watch: true
  })

  console.log(error)
  const {data:statusVote} = useContractRead({
    ...votingContract,
    functionName: 'voters',
    args: [address, isConnected ? Number(data[0].result) : 1],
    watch: true
  })

  const handleConnect = async () => {
    toast.loading("Loading...")
    await connect({
      connector: new InjectedConnector(),
    })

    toast.dismiss()
    toast.success("Wallet Connected!")
  }

  const handleDisconnect = async () => {
    await disconnect()
    toast.success("Wallet Disconnected!")
  }

  const fetchVoteHistory = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/v1/vote-history`)

      setVoteHistory(response.data.data)
    } catch (error) {
      toast.dismiss();
      console.log(error)
      toast.error("Error Fetch Vote History!")
    }
  }

  const saveVoteHistory = async (voteHistoryBody) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/v1/vote-history`, voteHistoryBody)
    } catch (error) {

    }
  }

  const fetchInitialData = async () => {
    try{
      if(isConnected && data){
        // Handle mapping candidate
        let candidateMapping = []

        for(let i = 0; i < 2; i++){
          let candidateData = await readContracts({
            contracts: [
              {
                ...votingContract,
                functionName: 'candidates',
                args: [i]
              },
              {
                ...votingContract,
                functionName: 'getCandidateVoteCount',
                args: [i, Number(data[0].result)]
              }
            ],
          })

          let candidateObj = {
            name: candidateData[0].result,
            voteCounts: Number(candidateData[1].result)
          }

          candidateMapping.push(candidateObj)
        }

        setCandidates(candidateMapping)
      }
    }catch(error){
      toast.dismiss();
      console.log(error)

      toast.error("Error fetch initial data!")
    }
  }

  const voteCandidate = async (id) => {
    try{
      toast.loading("prepare voting..")

      const { request } = await prepareWriteContract({
        ...votingContract,
        functionName: 'vote',
        args: [id],
      })

      const {hash} = await writeContract(request)

      toast.dismiss();

      toast.loading(`waiting voting transactions : ${hash}`, {
        style: {
          maxWidth: 630,
          textAlign: 'left'
        }
      })

      const txData = await waitForTransaction({
        hash: hash,
      })

      // decode event logs from receipt tx
      const iface = new ethers.utils.Interface(VOTING_ABI);
      const parsed = iface.parseLog(txData.logs[0]);
      console.log(parsed, "PARSED EVENT")
      
      let voteHistoryBody = {
        voters: parsed.args[1],
        candidate: parsed.args[0],
        round: Number(parsed.args[2]),
        timestamp: Number(parsed.args[3])
      }

      console.log(voteHistoryBody)

      await saveVoteHistory(voteHistoryBody)
      await fetchInitialData()
      await fetchVoteHistory()
      toast.dismiss();
      toast.success("Vote Candidate Success")
    }catch(err){
      toast.dismiss();
      console.log(err)
      
      toast.error("Vote Candidate Error!")
    }
  }

  const startNewRound = async () => {
    try{
      if(data[1].result && isConnected){
        if(data[1].result != address){
          toast.error("You are not owner!")
          return
        }

        // owner can start new round
        toast.loading("preparing newRound..")

        const { request } = await prepareWriteContract({
          ...votingContract,
          functionName: 'startNewRound',
        })
  
        const {hash} = await writeContract(request)
  
        toast.dismiss();
  
        toast.loading(`waiting voting transactions : ${hash}`, {
          style: {
            maxWidth: 630,
            textAlign: 'left'
          }
        })
  
        const txData = await waitForTransaction({
          hash: hash,
        })

        console.log(txData, "Start New Round receipt!")
        await fetchInitialData()
        toast.dismiss();
        toast.success("Vote Candidate Success")
      }
    }catch(err){
      console.log(err)
      toast.dismiss()
      toast.error("Start New Round Error!")
    }
  }

  useEffect(() => {
    const handleConnectorUpdate = ({account, chain}) => {
        if (account) {
          console.log("change Account")
        } else if (chain) {
          console.log("change Network")
        }
    }
  
    if (activeConnector) {
      activeConnector.on('change', handleConnectorUpdate)
    }
    
    fetchInitialData()
    fetchVoteHistory()
  }, [activeConnector])
  

  return (
    <Box sx={{ flexGrow: 1  }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}>
            <img src={zexoLogo}  className="logo" alt="Zexo Logo" />
            <Typography variant='h4' pt={6}>Zexo Voting System</Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
        {
          isConnected ? (<Button variant='contained'  color='secondary' onClick={() => handleDisconnect()}>{address}</Button>) : <Button  variant='contained' onClick={() => handleConnect()} color='secondary'>Connect Your Wallet!</Button>
        }
        </Grid>
        <Divider />
        
        <Grid item xs={12} >
          <Typography variant='h5' mb={1}>Current Round: {isConnected ? Number(data[0].result) : "X" }</Typography>
          <Button color='secondary' size='small' variant='contained' onClick={() => startNewRound()}>Start New Round</Button>
        </Grid>
        <Grid item xs={12}>
          <Box display={'flex'} flexDirection={'row'} gap={4} justifyContent={'center'} flexWrap={'wrap'} flexGrow={'1'}>
          {
            candidates.map((item, i) => (
              <Card sx={{ maxWidth: 300 }} key={i}>
                <CardMedia
                  component="img"
                  alt="pancake image"
                  image={i % 2 == 0 ? pancake1 : pancake2}
                  height={300}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vote Count : {item.voteCounts}
                  </Typography>
                </CardContent>
                {
                  isConnected && 
                  <CardActions>
                  {
                    statusVote ? <Button fullWidth disabled color='secondary' variant='contained'>You already voted</Button> : <Button fullWidth color='secondary' onClick={() => voteCandidate(i)} variant='contained'>Vote</Button>
                  }
                  </CardActions>
                }
              </Card>
            ))
          }
          </Box>
        </Grid>
        
        <Grid Grid item xs={12} mt={15}>
        <Typography variant='h3' mb={5}>Transaction History</Typography>
        <TransactionHistory voteHistory={voteHistory}/>
        </Grid>
      </Grid>

      <Toaster />
    </Box>
  )
}

export default App
