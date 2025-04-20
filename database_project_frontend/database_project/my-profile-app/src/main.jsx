import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './ProfilePage/index.css'
import { LoginProvider } from './LoginContext/LoginContext'
import { UserProvider } from './LoginContext/UserContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoginProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </LoginProvider>
  </StrictMode>,
)