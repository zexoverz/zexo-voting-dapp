import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import zexoLogo from '/zexo.png'
import './App.css'
import {Box, Button, Divider, Grid, Typography, Card, CardActions, CardContent, CardMedia} from '@mui/material';
import pancake1 from '/pancake1.png'
import pancake2 from '/pancake2.png'
import TransactionHistory from './components/TransactionHistory'
import toast, { Toaster } from 'react-hot-toast';
import { ethers } from "ethers";
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { VOTING_ABI, VOTING_ADDRESS } from './constant'
import { getContract } from 'viem'
import { readContracts, readContract } from '@wagmi/core'

const votingContract = {
  address: VOTING_ADDRESS,
  abi: VOTING_ABI,
}


function App() {
  const [flag, setFlag] = useState(false)
  const { isConnected, address, connector: activeConnector } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const [ currentRound, setCurrentRound] = useState("X")
  const [ ownerAddress, setOwnerAddress] = useState("X")
  const [ candidates, setCandidates] = useState([])

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

  const fetchInitialData = async () => {
    try{
      let data = await readContracts({
        contracts: [
          {
            ...votingContract,
            functionName: 'currentRound',
          },
          {
            ...votingContract,
            functionName: 'owner',
          },
          {
            ...votingContract,
            functionName: 'candidatesCount',
          }
        ]
      })

      if(data){
        setCurrentRound(Number(data[0].result))
        setOwnerAddress(data[1].result)

        let candidateCount = Number(data[2].result)
        let candidateMapping = []

        for(let i = 0; i < candidateCount; i++){
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
                args: [i, currentRound]
              }
            ]
          })

          console.log(candidateData, "CANDIDATE DATA")

          let candidateObj = {
            name: candidateData[0].result,
            voteCounts: Number(candidateData[1].result)
          }

          candidateMapping.push(candidateObj)
        }

        console.log(candidateMapping, "CANDIDATE MAPPING")

        setCandidates(candidateMapping)
      }
    }catch(error){
      console.log(error)

      toast.error("Error fetch initial data!")
    }
  }

  useEffect(() => {
    const handleConnectorUpdate = ({account, chain}) => {
        if (account) {
          toast.success("Change Account!")
        } else if (chain) {
          toast.success("Change Network!")
        }
    }
  
    if (activeConnector) {
      activeConnector.on('change', handleConnectorUpdate)
    }
    
    fetchInitialData()

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
          <Typography variant='h5' mb={1}>Current Round: {currentRound}</Typography>
          <Button color='secondary' size='small' variant='contained'>Start New Round</Button>
        </Grid>
        <Grid item xs={12}>
          <Box display={'flex'} flexDirection={'row'} gap={4} justifyContent={'center'} flexWrap={'wrap'} flexGrow={'1'}>
          {
            candidates.map(item => (
              <Card sx={{ maxWidth: 300 }}>
                <CardMedia
                  component="img"
                  alt="pancake image"
                  image={pancake1}
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
                <CardActions>
                  <Button fullWidth color='secondary' variant='contained'>Vote</Button>
                </CardActions>
              </Card>
            ))
          }
          </Box>
        </Grid>
        
        <Grid Grid item xs={12} mt={10}>
        <Typography variant='h3'>Transaction History</Typography>
        <TransactionHistory />
        </Grid>
      </Grid>

      <Toaster />
    </Box>
  )
}

export default App
