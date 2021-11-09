import { Grid, Box, Typography, Chip, Divider, Stack, TextField, Button } from "@mui/material"
import { useRef, useContext, useState } from "react";
import NavBar from "./Navbar"
import { AuthContext } from "./Contexts/AuthContext";

function Profile(){
    const context = useContext(AuthContext);
    const nameRef = useRef();
    const emailRef = useRef();
    const institutionRef = useRef();
    const [load, setLoad] = useState(true)

    function handleChange(){
        const data = {
            name: nameRef.current.value, 
            email: emailRef.current.value, 
            instition: institutionRef.current.value
        }
       context.updateUser(data)
    }
    console.log(context)

    return (
        <>
        <NavBar />
        <Box sx={{display: "flex", justifyContent: "space-evenly", flexWrap: "wrap", alignItems: "center", width : "100%", minHeight: "80vh"}}>     
            <Box >
                {typeof(context.team) != "undefined" && <Chip sx={{fontSize: {xs: 17, md: 22}, p:3.5 , my:2}} label={`Team: ${context.team.teamName}`}></Chip>}
                <Divider />
                <Stack sx={{display: "inline-block"}}>
                {typeof(context.team) != "undefined" &&
                context.team.members.map((item) => {
                    return (
                    <> 
                        <Chip key={item.uid} sx={{ mt: 2, fontSize: 17, p:3}} variant="outlined" label={item.name}></Chip> <br />
                    </>
                    )
                }) }
                    
                </Stack>
            </Box>
            <Box>
                <Divider orientation="vertical" sx={{height: 300, display:{xs: "none", sm:"block" } }} flexItem ></Divider>
                <Divider orientation="horizontal" sx={{width:300, my:6, display:{sm: "none", xs:"block" } }} flexItem ></Divider>
            </Box>
               
            <Box width={350} mx={3}>
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
                    <Button variant="contained" onClick={handleChange} size="large">Update</Button>
                </Stack>
            </Box>
        </Box>
    </>
    )
}

export default Profile