import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import './App.css'
import Auth from "./routes/auth.js"

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth/>}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
