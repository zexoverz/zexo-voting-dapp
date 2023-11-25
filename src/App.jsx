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


function App() {
  const [flag, setFlag] = useState(false)
  const { isConnected, address, connector: activeConnector } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

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
  
    // return () => activeConnector.off('change', handleConnectorUpdate)
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
          <Typography variant='h5' mb={1}>Current Round: 1</Typography>
          <Button color='secondary' size='small' variant='contained'>Start New Round</Button>
        </Grid>
        <Grid item xs={12}>
          <Box display={'flex'} flexDirection={'row'} gap={4} justifyContent={'center'} flexWrap={'wrap'} flexGrow={'1'}>
          <Card sx={{ maxWidth: 300 }}>
            <CardMedia
              component="img"
              alt="green iguana"
              image={pancake1}
              height={300}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Candidate 1
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vote Count : 10
              </Typography>
            </CardContent>
            <CardActions>
              <Button fullWidth color='secondary' variant='contained'>Vote</Button>
            </CardActions>
          </Card>

          <Card sx={{ maxWidth: 300,  }}>
            <CardMedia
              component="img"
              alt="green iguana"
              image={pancake2}
              height={300}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Candidate 2
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vote Count : 10
              </Typography>
            </CardContent>
            <CardActions>
              <Button fullWidth color='secondary' variant='contained'>Vote</Button>
            </CardActions>
          </Card>
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
