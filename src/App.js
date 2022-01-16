import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router";
import "./App.css";
import { CssBaseline, Paper } from "@mui/material";
import Team from "./Team";
import SignUp from "./Signup";
import Profile from "./Profile";
import Submission from "./Submission";
import TeamJoin from "./TeamJoin";
import Admin from "./Admin/AdminNew";
import PrivateRoute from "./PrivateRoute";
import TnC from "./TnC";
import Dashboard from "./Dashboard";

function App() {
  return (
    <>
      <CssBaseline />
      <Paper
        sx={{ borderRadius: 0, bgcolor: "theme.palette.background.paper" }}
      >
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/Submission"
            element={
              <PrivateRoute>
                <Submission />
              </PrivateRoute>
            }
          />
          <Route path="/team" element={<Team />} />
          <Route path="/team/join" element={<TeamJoin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Paper>
    </>
  );
}

export default App;
