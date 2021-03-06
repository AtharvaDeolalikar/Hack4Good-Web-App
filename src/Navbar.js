import { AppBar, Typography, Toolbar, Button, IconButton } from "@mui/material";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useState } from "react";
import { Divider } from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import ListItemIcon from "@mui/material/ListItemIcon";
import { AuthContext } from "./Contexts/AuthContext";
import { Link } from "react-router-dom";
import GroupIcon from "@mui/icons-material/Group";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import SubmissionInstructions from "./SubmissionInstructions";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";

function NavBar() {
  const context = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [submissionInstructions, setSubmissionInstructions] = useState(false);

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          Hack4Good
        </Typography>
        {window.location.pathname !== "/submission" && (
          <Button
            variant="outlined"
            component={Link}
            to="/submission"
            sx={{ mx: 2, display: { xs: "none", sm: "flex" } }}
            startIcon={<AssignmentOutlinedIcon />}
          >
            Submission
          </Button>
        )}
        {window.location.pathname === "/submission" && (
          <Button
            variant="outlined"
            onClick={() => setSubmissionInstructions(true)}
            sx={{ mx: 2, display: { xs: "none", sm: "flex" } }}
            startIcon={<AssignmentOutlinedIcon />}
          >
            Submission Instructions
          </Button>
        )}
        <SubmissionInstructions
          open={submissionInstructions}
          close={() => setSubmissionInstructions(false)}
        />

        <IconButton onClick={handleClick}>
          <MenuIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem component={Link} to="/dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            Dashboard
          </MenuItem>
          <MenuItem component={Link} to="/submission">
            <ListItemIcon>
              <AssignmentOutlinedIcon />
            </ListItemIcon>
            Submission
          </MenuItem>

          <Divider />

          <MenuItem component={Link} to="/profile">
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            My Profile
          </MenuItem>

          <MenuItem component={Link} to="/team">
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            My Team
          </MenuItem>

          <Divider />

          <MenuItem onClick={() => context.logOut()}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
