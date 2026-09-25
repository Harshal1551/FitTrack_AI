import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'

import { store } from './store/store'
import App from './App'
import { authConfig } from './authConfig'
import { AuthProvider } from 'react-oauth2-code-pkce'

import './index.css'   // ⬅️ Tailwind MUST be imported here

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0B0F14',
      paper:   '#151A21',
    },
    primary: { main: '#A3E635' },
    secondary: { main: '#22D3EE' },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
    },
    divider: '#232A33',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
})

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <AuthProvider authConfig={authConfig}>
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </AuthProvider>
)