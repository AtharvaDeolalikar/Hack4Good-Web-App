import {
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./Contexts/AuthContext";
import NavBar from "./Navbar";
import { Link } from "react-router-dom";

function TeamJoin() {
  const [teamName, setTeamName] = useState();
  const context = useContext(AuthContext);
  const teamID = new URLSearchParams(window.location.search).get("teamID");

  useEffect(() => {
    async function _useEffect() {
      if (!teamID) {
        context.showAlert("error", "Enter the team ID first.");
        context.navigate("/team");
        return false;
      }
      const result = await context.findTeam(teamID);
      if (!result) {
        context.navigate("/team");
      } else {
        setTeamName(result);
      }
    }
    _useEffect();
  }, []);

  return (
    <>
      <NavBar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          width: "100%",
          textAlign: "center",
        }}
      >
        {teamName ? (
          <Box
            sx={{
              maxWidth: 400,
              p: 3,
              m: 2,
              borderRadius: 5,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Stack spacing={3}>
              <Typography variant="h5">Join Team</Typography>
              <Divider />
              <Typography fontSize={18} color="#dedede">
                Do you really want to join the team {teamName}?
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
                <Button
                  variant="contained"
                  onClick={() => context.joinTeam(teamID, teamName)}
                >
                  Accept
                </Button>
                <Button variant="outlined" component={Link} to="/team">
                  Reject
                </Button>
              </Box>
            </Stack>
          </Box>
        ) : (
          <CircularProgress />
        )}
      </Box>
    </>
  );
}

export default TeamJoin;
