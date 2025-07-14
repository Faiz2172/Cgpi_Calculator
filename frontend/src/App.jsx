import './App.css'
import CGPACalculator from './components/home.jsx'
import { Analytics } from "@vercel/analytics/next"

function App() {
  return (
    <div>
      <Analytics/>
      <CGPACalculator />
    </div>
  )
}

export default App
