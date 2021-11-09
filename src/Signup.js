import { TextField, Typography, Stack, Button, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useState, useRef} from "react";
import { AuthContext } from "./Contexts/AuthContext";

function SignUp(){
    const context = useContext(AuthContext);
    const nameRef = useRef();
    const emailRef = useRef();
    const institutionRef = useRef();

    function handleChange(){
        const data = {
            name: nameRef.current.value, 
            email: emailRef.current.value, 
            instition: institutionRef.current.value
        }
        context.addUser(data)
    }
    return (
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight : "85vh", width : "100%"}}>
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            
            <Grid container sx={{textAlign: 'center'}}>
                <Grid item xl={12} xs={12} sx={{mb : 7, mt: {xs: 3, md: 0}}}> 
                    <Typography variant="h2" sx={{ fontSize: {xs: 35, md: "h2.fontSize"} , fontWeight: 500 }}>Hack4Good</Typography>
                    <Typography variant="p" color="#cacbcc">by IEEE CIS SBC - GHRCE</Typography>
                </Grid> 
                <Grid item xl={12} xs={12} sx={{display: "flex", justifyContent: "center"}}>    
                    <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", padding:3, textAlign: "center", width: 350, borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}`}}>
                        <Stack sx={{width: 1}} spacing={3}>
                        <Typography variant="h5">Sign up</Typography>
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
                            required  
                            inputRef={institutionRef}        
                        />
                        <Button variant="contained" onClick={handleChange} size="large">Register</Button>
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    </Box>
    )
}

export default SignUp;