import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider, createTheme } from '@mui/material/styles';;
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { sepolia } from '@wagmi/core'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider, } from 'wagmi/providers/public'
import {polygonMumbai,} from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'

 

const { chains, publicClient } = configureChains(
  [polygonMumbai],
  [alchemyProvider({ apiKey: 'WAIvpIfI8p5UMIzosJ4Z8cxDLgo1zfjm' }), publicProvider()],
)

const config = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient,
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
