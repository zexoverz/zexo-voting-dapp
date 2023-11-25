import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider, createTheme } from '@mui/material/styles';;
import { WagmiConfig, createConfig, } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { sepolia } from '@wagmi/core'
 
const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: sepolia,
    transport: http()
  }),
})

const theme = createTheme({
  palette: {
    secondary: {
      main: '#6bc5de'
    }
  }
});




ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </WagmiConfig>
    
  </React.StrictMode>,
)
