import { createRoot } from 'react-dom/client'
import { completeGoogleLogin } from './api/auth.js'
import './index.css'
import App from './app/App.jsx'

completeGoogleLogin()

createRoot(document.getElementById('root')).render(
    <App />
)
