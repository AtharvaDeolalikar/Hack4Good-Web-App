import { Grid, Box, Typography, Chip, Divider, Stack, TextField, Button, Alert, InputAdornment, IconButton } from "@mui/material"
import { useRef, useContext, useState } from "react";
import NavBar from "./Navbar"
import { AuthContext } from "./Contexts/AuthContext";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from "react-router";

function Profile(){
    const context = useContext(AuthContext);
    const navigate = useNavigate()
    const nameRef = useRef();
    const emailRef = useRef();
    const institutionRef = useRef();
    const teamNameRef = useRef();
    const [load, setLoad] = useState(true)

    function updateProfile(){
        const data = {
            name: nameRef.current.value, 
            email: emailRef.current.value, 
            instition: institutionRef.current.value
        }
        
       context.updateUser(data)
    }

    function updateTeamName(){
        context.updateTeam(teamNameRef.current.value)
    }

    return (
        <>
        <NavBar />
        
        <Box sx={{display: "flex", justifyContent: "space-evenly", flexWrap: "wrap", alignItems: "center", width : "100%", minHeight: "80vh"}}>     
        {context.team ? 
            <Box sx={{textAlign: "center"}}>
                <Chip sx={{fontSize: {xs: 17, md: 22}, p:3.5 , my:2}} label={`Team: ${context.team.teamName}`}></Chip>
                <Box >
                <Alert sx={{borderRadius:3,  maxWidth: 350, my:2}} severity="info">This hackathon let’s you have upto 4 teammates. Share the code below to add teammates.</Alert>
                <CopyToClipboard
                    options={{ debug: true, message: "" }}
                    text={context.userData.teamID}
                    onCopy={() => context.showAlert("success", "Team ID has been copied to Clipboard!")}>
                    <TextField 
                        defaultValue={context.userData.teamID}
                        InputProps={{
                            endAdornment: <InputAdornment position="end"><IconButton ><ContentCopyIcon /></IconButton></InputAdornment>,
                            readOnly: true
                          }}
                        
                        ></TextField>
                </CopyToClipboard>
            
                    {/* <Typography sx={{bgcolor:"blue", maxWidth: 450, borderRadius:3, p:2}} >This hackathon let’s you have upto 4 teammates. Share the code below to add teammates.</Typography> */}
                </Box>

                <Divider sx={{my:2}}/>
                <Stack sx={{display: "inline-block"}}>

                {context.team.members.map((item, index) => {
                    var currentIndex = (index + 1 ).toString() + ". "
                    return (
                        <> 
                        <Chip key={item.uid} sx={{ fontSize: 17, p:3}} variant="outlined" label={currentIndex + item.name}></Chip> <br />
                        </>
                    )
                }) }
                    
                </Stack>
            </Box> : 
            <>
            <Box textAlign="center">
            <Typography variant="h6" maxWidth={400} >Create or join a team first in order to make your submissions!</Typography>
            <Button onClick={() => navigate("/team")}>Start</Button></Box>
            </>}

            <Box>
                <Divider orientation="vertical" sx={{height: 300, display:{xs: "none", sm:"block" } }} flexItem ></Divider>
                <Divider orientation="horizontal" sx={{width:300, my:6, display:{sm: "none", xs:"block" } }} flexItem ></Divider>
            </Box>
               
            <Box width={350} >
                <Typography variant="h5" align="center">Update Profile</Typography>
                <Stack sx={{width: 1}} spacing={3}>
                    <TextField
                        margin="normal"
                        id="Name"
                        label="Name"
                        defaultValue= {context.currentUser.displayName}
                        name= "name"
                        required 
                        inputRef={nameRef}          
                    />
                    <TextField
                        margin="normal"
                        id="Name"
                        label="Email"
                        name="Email"
                        defaultValue = {context.currentUser.email}
                        disabled
                        inputRef={emailRef}         
                    />
                    <TextField
                        margin="normal"
                        id="Name"
                        label="Institution"
                        name="Institution"
                        defaultValue = {context.userData.instition}
                        required  
                        inputRef={institutionRef}
                    />
                    <Button variant="contained" onClick={updateProfile} size="large">Update</Button>
                </Stack>                
            </Box>
            
            {context.team ?
            <Box>
                <Divider orientation="vertical" sx={{height: 300, display:{xs: "none", sm:"block" } }} flexItem ></Divider>
                <Divider orientation="horizontal" sx={{width:300, my:6, display:{sm: "none", xs:"block" } }} flexItem ></Divider>
            </Box> : < > </>}

            {context.team ? 
            <Box width={350} >
                <Typography variant="h5" align="center">Update Team</Typography>
                <Stack sx={{width: 1}} spacing={3}>
                    <TextField
                        margin="normal"
                        id="TeamName"
                        label="Team Name"
                        defaultValue= {context.team.teamName}
                        name= "TeamName"
                        required 
                        inputRef={teamNameRef}          
                    />
                    <Button variant="contained" onClick={updateTeamName} size="large">Update</Button>
                </Stack> 
            </Box> : < > </>}
        </Box> 
    </>
    )
}

export default Profile