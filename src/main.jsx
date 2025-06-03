
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Contextprovider from './contexts/Contextprovider.jsx'
import UserProvider from './contexts/userContext.jsx'

createRoot(document.getElementById('root')).render(
  <Contextprovider>
    <UserProvider>
      <App />
    </UserProvider>
  </Contextprovider>
  
)
