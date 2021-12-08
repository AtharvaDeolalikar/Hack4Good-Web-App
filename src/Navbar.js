import { AppBar, Typography, Toolbar, Avatar, Chip, Button} from "@mui/material"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useContext, useState } from "react";
import { Divider } from "@mui/material";
import Logout from '@mui/icons-material/Logout'
import ListItemIcon from '@mui/material/ListItemIcon';
import { AuthContext } from "./Contexts/AuthContext";
import { Link } from "react-router-dom";
import GroupIcon from '@mui/icons-material/Group';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';

function NavBar(){
    const context = useContext(AuthContext)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar
            position="fixed"
            color="default"
            elevation={0}
            sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
            <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                Hack4Good
            </Typography>
            <Button variant="outlined" component={Link} to="/submission" sx={{mx: 2, display:{xs: "none", sm:"flex"}}} startIcon={<AssignmentOutlinedIcon  />}>Submission</Button>
            <Avatar onClick={handleClick} sx={{ bgcolor: "#fafafa" }}>
                <AccountCircleIcon />
            </Avatar>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                    },
                    '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                    },
                },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
            <MenuItem component={Link} to="/Submission">
                <ListItemIcon>
                    <AssignmentOutlinedIcon  />
                </ListItemIcon>
                    Submission
            </MenuItem>


            <Divider />

            <MenuItem component={Link} to="/profile">
                <ListItemIcon>
                    <AccountBoxIcon  />
                </ListItemIcon>
                My Profile
            </MenuItem>


            <MenuItem component={Link} to="/team">
                <ListItemIcon>
                    <GroupIcon  />
                </ListItemIcon>
                My Team
            </MenuItem>
            
            <Divider /> 

            <MenuItem onClick={() => context.logOut()}>
                <ListItemIcon>
                    <Logout  />
                </ListItemIcon>
                Logout
            </MenuItem>
        </Menu>
            
        </Toolbar>
    </AppBar>
    )
}

export default NavBar