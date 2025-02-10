import { useState } from 'react'
import AppRoutes from './routes/AppRoutes'
import './index.css'; 

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppRoutes />
    </>
  )
}

export default App
