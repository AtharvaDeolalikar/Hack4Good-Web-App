import { Box, Typography, Stack, TextField, FormControlLabel, FormLabel, RadioGroup, FormControl, Radio } from "@mui/material"
import { useRef, useContext, useState } from "react";
import NavBar from "./Navbar"
import { AuthContext } from "./Contexts/AuthContext";
import { LoadingButton } from "@mui/lab";
import Footer from "./Footer";

function Profile(){
    const context = useContext(AuthContext);
    const nameRef = useRef();
    const emailRef = useRef();
    const institutionRef = useRef();
    const phoneRef = useRef();
    const cityRef = useRef();
    const ageRef = useRef();
    const [gender, setGender] = useState(context.userData.gender);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [edit, setEdit] = useState(false)

    function ToggleButtonLoad(){
        setButtonLoading(buttonLoading => !buttonLoading)
    }

    async function updateProfile(){
        if(!edit){
            setEdit(true)
            return false
        }
        ToggleButtonLoad()
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
            ToggleButtonLoad()
            return false
        }
        for (const property in data) {
            if(data[property].length === 0){
              context.showAlert("error", `Enter ${property} first!`)
              ToggleButtonLoad()
              return false
            } 
          }
        
       await context.updateUser(data, ToggleButtonLoad)
       ToggleButtonLoad()
       setEdit(false)
    }


    return (
        <>
        <NavBar />
        
        <Box sx={{display: "flex", justifyContent: "space-evenly", flexWrap: "wrap", alignItems: "center", width : "100%", minHeight: "100vh",  mt:{xs:7, sm:8} , mb: 8}}>               
            <Box sx={{width:{xs: "100%", sm: "500px"}}} >
                <Typography variant="h5" align="center" my={2}>Update Profile</Typography>
                    <Box sx={{borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}`, padding:3, my:3}}>
                    <Stack sx={{width: 1}} spacing={3}>
                        <TextField
                            margin="normal"
                            id="Name"
                            label="Name"
                            disabled={!edit}
                            defaultValue= {context.userData.name}
                            name= "name"
                            inputRef={nameRef}          
                        />
                        <TextField
                            margin="normal"
                            id="Name"
                            label="Email"
                            name="Email"
                            defaultValue = {context.userData.email}
                            disabled
                            inputRef={emailRef}         
                        />
                        <TextField
                            margin="normal"
                            id="PhoneNo"
                            label="Phone No"
                            name="PhoneNo"
                            disabled={!edit}
                            defaultValue = {context.userData.phoneNo}
                            inputRef={phoneRef}        
                        />
                        <FormLabel component="legend" sx={{textAlign : "left"}} >Additional Details</FormLabel>
                        <TextField
                            margin="normal"
                            id="Name"
                            label="Institution"
                            name="Institution" 
                            disabled={!edit}
                            defaultValue = {context.userData.institution} 
                            inputRef={institutionRef}        
                        />
                        <TextField
                            margin="normal"
                            id="City"
                            label="City / Town"
                            name="City/Town"  
                            disabled={!edit}
                            defaultValue = {context.userData.city} 
                            inputRef={cityRef}        
                        />
                        <Box sx={{display: "flex", justifyContent : "space-between", flexDirection : "row"}}>
                            <FormControl disabled={!edit} component="fieldset">
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
                        <TextField sx={{maxWidth : 100}}  disabled={!edit} inputRef={ageRef} defaultValue={context.userData.age} type="number" label="Age" />
                        </Box>
                        <LoadingButton size="large" loading={buttonLoading} onClick={updateProfile}  variant="contained" >{!edit ? "Edit" : "Update"} Profile</LoadingButton>
                    </Stack>  
                </Box>              
            </Box>
        </Box> 
        <Footer />
    </>
    )
}

export default Profile