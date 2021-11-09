import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import './App.css';
import Submission from "./Submission";
import { ThemeProvider } from '@mui/material/styles'
import Theme from "./Theme";
import { Box } from "@mui/system";
import { CssBaseline, Paper, Typography } from "@mui/material";
import Team from './Team'
import { AuthContext } from "./Contexts/AuthContext"
import SignUp from "./Signup";
import Profile from "./Profile"

function App() {
  const context = useContext(AuthContext)

  if (context.currentUser){
    return (
      <>
        <ThemeProvider theme={Theme}>
          <CssBaseline/>
            <Paper sx={{borderRadius : 0, minHeight: "100vh"}}>
              <Routes>
                <Route path="Submission" element={<Submission />}>
                  <Route path="" element={<Box>CC</Box>} />
                  <Route path="Round-1" element={<Box><Typography variant="h1">A</Typography></Box>} />
                  <Route path="Round-2" element={<Box><Typography variant="h1">B</Typography></Box>} />
                </Route>
                <Route path="/team" element={<Team />}>
                </Route> 
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<Profile />} />  
                <Route path="*" element={<Typography variant="h4"> Not Found </Typography>} />
              </Routes>
            </Paper>
        </ThemeProvider>
    </>
    )} else {
    return "Loading..."
  }
}

export default App;
