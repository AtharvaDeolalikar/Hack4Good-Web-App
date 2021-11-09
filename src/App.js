import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router";
import './App.css';
import Submission from "./Submission";
import { CssBaseline, Paper } from "@mui/material";
import Team from './Team'
import { AuthContext } from "./Contexts/AuthContext"
import SignUp from "./Signup";
import Profile from "./Profile"

import Round1 from "./Submissions/Round1";
import Round2 from "./Submissions/Round2";

function App() {
  const context = useContext(AuthContext)

  if (context.currentUser){
    return (
      <>
          <CssBaseline/>
            <Paper sx={{borderRadius : 0, minHeight: "100vh"}}>
              <Routes>
                <Route path="Submissions" element={<Submission />}>
                  <Route path="" element={<Round1 />} />
                  <Route path="Round-1" element={<Round1 />} />
                  <Route path="Round-2" element={<Round2 />} />
                </Route>
                <Route path="/team" element={<Team />}>
                </Route> 
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<Profile />} />  
                <Route path="*" element={<Navigate to="submissions" /> } />
              </Routes>
            </Paper>
    </>
    )} else {
    return "Loading..."
  }
}

export default App;
