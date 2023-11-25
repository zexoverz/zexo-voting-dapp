import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import zexoLogo from '/zexo.png'
import './App.css'
import {Box, Button, Divider, Grid, Typography, Card, CardActions, CardContent, CardMedia} from '@mui/material';
import pancake1 from '/pancake1.png'
import pancake2 from '/pancake2.png'
import TransactionHistory from './components/TransactionHistory'

function App() {
  const [flag, setFlag] = useState(false)

  return (
    <Box sx={{  }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}>
            <img src={zexoLogo}  className="logo" alt="Zexo Logo" />
            <Typography variant='h4' pt={6}>Zexo Voting System</Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
        {
          flag ? (<Button variant='contained'  color='secondary' onClick={() => setFlag(!flag)}> 0x37eC410f573d6D22E5bD41fE14ea01Ab0A20B562</Button>) : <Button  variant='contained' onClick={() => setFlag(!flag)} color='secondary'>Connect Your Wallet!</Button>
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
    </Box>
  )
}

export default App
