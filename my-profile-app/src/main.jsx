import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LoginProvier } from './LoginContext/LoginContext.jsx'
import { UserProvier } from './LoginContext/UserContext.jsx'
import App from './App.jsx'
import './ProfilePage/index.css'  // Add this import

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoginProvier>
      <UserProvier>
        <App />
      </UserProvier>
    </LoginProvier>
  </StrictMode>,
)