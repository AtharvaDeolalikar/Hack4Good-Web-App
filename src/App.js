import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router";
import './App.css';
import Submission from "./Submission";
import { CssBaseline, Paper } from "@mui/material";
import Team from './Team'
import SignUp from "./Signup";
import Profile from "./Profile"
import Round1 from "./Submissions/Round1";
import Round2 from "./Submissions/Round2";
import SubmissionsList from "./SubmissionsList";
import TeamJoin from "./TeamJoin";

function App() {
  return (
    <>
      <CssBaseline/>
      <Paper sx={{borderRadius : 0, bgcolor : "theme.palette.background.paper"}}>
        <Routes>
          <Route path="Submissions" element={<Submission />}>
            <Route path="" element={<SubmissionsList />} />
            <Route path="Round-1" element={<Round1 />} />
            <Route path="Round-2" element={<Round2 />} />
          </Route>
          <Route path="/team" element={<Team />} />
          <Route path="/team/join" element ={<TeamJoin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} /> 
          <Route path="*" element={<Navigate to="/profile" /> } />
        </Routes>
      </Paper>
    </>
    )
}

export default App;
