import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LoginProvier } from './LoginContext/LoginContext.jsx'
import App from './App.jsx'
import './ProfilePage/index.css'  // Add this import

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoginProvier>
      <App />
    </LoginProvier>
  </StrictMode>,
)