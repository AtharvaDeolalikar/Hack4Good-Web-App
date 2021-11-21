import { LoadingButton } from "@mui/lab";
import { TextField, Typography, Stack, Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useState, useRef, useEffect} from "react";
import { AuthContext } from "./Contexts/AuthContext";
import Footer from "./Footer";

function SignUp(){
    const context = useContext(AuthContext);
    const nameRef = useRef();
    const emailRef = useRef();
    const institutionRef = useRef();
    const phoneRef = useRef();
    const cityRef = useRef();
    const ageRef = useRef();
    const [gender, setGender] = useState('male');
    const [buttonLoading, setButtonLoading] = useState(false);

    useEffect(() => {
        if(context.userData){
            context.navigate("profile")
        }
    })

    function handleChange(){
        setButtonLoading(true)
        const data = {
            name: nameRef.current.value, 
            email: emailRef.current.value, 
            phoneNo: phoneRef.current.value,
            institution: institutionRef.current.value,
            city: cityRef.current.value,
            gender : gender,
            age: ageRef.current.value
        }
        if (phoneRef.current.value && !phoneRef.current.value.startsWith("+")){
            context.showAlert("error", "The phone number must start with the country code. Eg. +91")
            setButtonLoading(false)
            return false
        }
        for (const property in data) {
            if(data[property].length === 0){
              context.showAlert("error", `Enter ${property} first!`)
              setButtonLoading(false)
              return false
            } 
          }
        context.addUser(data)
    }

    return (
        <>
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight : "100vh", width : "100%", mb:8 , pb:2}}>
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            
            <Grid container sx={{textAlign: 'center'}}>
                <Grid item xl={12} xs={12} sx={{mb : 7, mt: 3}}> 
                    <Typography variant="h2" sx={{ fontSize: {xs: 35, md: "h2.fontSize"} , fontWeight: 500 }}>Hack4Good</Typography>
                    <Typography variant="p" color="#cacbcc">by IEEE CIS SBC - GHRCE</Typography>
                </Grid> 
                <Grid item xl={12} xs={12} sx={{display: "flex", justifyContent: "center"}}>    
                    <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", padding:3, textAlign: "center", width:{xs: "100%", md: "500px"}, borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}`}}>
                        <Stack sx={{width: 1}} spacing={3}>
                        <Typography variant="h5">Sign up</Typography>
                        <TextField
                            margin="normal"
                            id="Name"
                            label="Name"
                            defaultValue= {context.currentUser.displayName}
                            name= "name"
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
                            id="PhoneNo"
                            label="Phone No"
                            name="PhoneNo"  
                            inputRef={phoneRef}        
                        />
                        <FormLabel component="legend" sx={{textAlign : "left"}} >Additional Details</FormLabel>
                        <TextField
                            margin="normal"
                            id="Name"
                            label="Institution"
                            name="Institution"  
                            inputRef={institutionRef}        
                        />
                        <TextField
                            margin="normal"
                            id="City"
                            label="City / Town"
                            name="City/Town"  
                            inputRef={cityRef}        
                        />
                        <Box sx={{display: "flex", justifyContent : "space-between", flexDirection : "row"}}>
                        <FormControl component="fieldset">
                            <FormLabel sx={{textAlign : "left"}} component="legend">Gender</FormLabel>
                                <RadioGroup
                                    row
                                    aria-label="gender"
                                    name="controlled-radio-buttons-group"
                                    value={gender}
                                    defaultValue = "male"
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                <Box><FormControlLabel value="male" control={<Radio />} label="Male" />
                                <FormControlLabel value="female" control={<Radio />} label="Female" /> </Box>   
                            </RadioGroup>
                        </FormControl>
                        <TextField sx={{maxWidth : 100}} inputRef={ageRef} type="number" label="Age" />
                        </Box>
                        <LoadingButton size="large" loading={buttonLoading} onClick={handleChange} variant="contained" >Sign Up </LoadingButton>
                        {/* <Button variant="contained" onClick={handleChange} size="large">Register</Button> */}
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    </Box>
    <Footer />
    </>
    )
}

export default SignUp;