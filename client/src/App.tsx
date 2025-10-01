import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import './App.css'
import Auth from "./routes/auth.js"
import VideoPage from "./videopage.js"
import { HomePage } from "./homePage.js"


function App() {
  

  return (
    <>
      <Router>
        <Routes>
          {/* <Route path="/auth" element={<Auth/>}></Route> */}
          <Route path="/" element={<HomePage/>}></Route>
          <Route path="/:roomId" element={<VideoPage/>}></Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
