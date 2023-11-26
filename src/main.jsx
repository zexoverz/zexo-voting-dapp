import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider, createTheme } from '@mui/material/styles';;
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider, } from 'wagmi/providers/public'
import {polygonMumbai, mainnet, optimism} from 'wagmi/chains'


const { chains, publicClient } = configureChains(
  [mainnet, polygonMumbai, optimism],
  [publicProvider()],
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
