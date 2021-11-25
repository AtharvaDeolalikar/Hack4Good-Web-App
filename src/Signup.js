import { LoadingButton } from "@mui/lab";
import { TextField, Typography, Stack, Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, InputLabel, Select, MenuItem, Divider } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useState, useEffect} from "react";
import { AuthContext } from "./Contexts/AuthContext";
import Footer from "./Footer";

function SignUp(){
    const context = useContext(AuthContext);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [degreeType, setDegreeType] = useState("")

    useEffect(() => {
        if(context.userData){
            context.navigate("profile")
        }
    })

    function handleSubmit(e){
        e.preventDefault()
        setButtonLoading(true)
        const data = {
            firstName: e.target.firstName.value,
            lastName: e.target.lastName.value,
            email: e.target.email.value,
            phoneNo : e.target.phoneNo.value,
            institution: e.target.institution.value,
            degreeType : e.target.degreeType.value,
            studyField : e.target.studyField.value,
            gender: e.target.gender.value,
            age: e.target.age.value
        }
        if (e.target.phoneNo.value && !e.target.phoneNo.value.startsWith("+")){
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
        console.log(data)
        context.addUser(data)
    }

    return (
        <>            
            <Grid component="form" onSubmit={handleSubmit} container sx={{ pt: 2, pb: 7, justifyContent : "space-evenly" }}>
                <Grid item xl={12} xs={12} sx={{py:2, textAlign : "center"}}> 
                    <Typography variant="h2" sx={{ fontSize: {xs: 35, md: "h2.fontSize"} , fontWeight: 500 }}>Hack4Good</Typography>
                    <Typography variant="p" color="#cacbcc">by IEEE CIS SBC - GHRCE</Typography>
                    <Divider sx={{maxWidth: 200, margin : "auto", my: 2}}/>
                    <Typography sx={{ fontSize: {xs: 30, md: "h5.fontSize"} , fontWeight: 400 }}>Signup</Typography>
                </Grid> 
            <Grid item md={5} sm={8} xs={11} my={2}>
                <Stack spacing={3}>
                    <Grid container sx={{justifyContent : "space-between"}}>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                sx={{pr: {xs:0, md: 1}}}
                                label="First Name"
                                defaultValue= {context.currentUser.firstName}
                                name= "firstName"        
                            />
                        </Grid>
                        <Grid item md={6} xs={12} sx={{mt: {xs:3, md: 0}}}>
                            <TextField
                                label="Last Name"
                                fullWidth
                                sx={{pl: {xs:0, md: 1}}}
                                name= "lastName"
                                defaultValue= {context.currentUser.lastName}     
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        label="Email"
                        name="email"
                        defaultValue = {context.currentUser.email}
                        disabled    
                    />
                    <TextField
                        label="Phone No"
                        name="phoneNo"
                    />
                    <TextField
                        label="Educational Institution"
                        name="institution"  
                    />
                    <Grid container sx={{justifyContent : "space-between"}}>
                        <Grid item md={6} xs={12}>
                            <FormControl fullWidth  sx={{pr: {xs:0, md: 1}}}>
                                <InputLabel >Degree Type</InputLabel>
                                    <Select value={degreeType} onChange={(e) => setDegreeType(e.target.value)} label="Degree Type" name="degreeType" >
                                        <MenuItem value="Associate">Associate</MenuItem>
                                        <MenuItem value="Bachelors">Bachelors</MenuItem>
                                        <MenuItem value="Masters">Masters</MenuItem>
                                        <MenuItem value="Doctoral">Doctoral</MenuItem>
                                        <MenuItem value="High School">High School</MenuItem>
                                    </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sx={{mt: {xs:3, md: 0}}}>
                            <TextField
                                fullWidth
                                name = "studyField"
                                label="Field of Study"
                                sx={{pl: {xs:0, md: 1}}}
                                placeholder = "Eg. Computer Science"        
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{display: "flex", justifyContent : "space-between", flexDirection : "row"}}>
                        <FormControl  >
                            <FormLabel component="legend">Gender</FormLabel>
                                <RadioGroup row name="gender">
                                    <Box>
                                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                                        <FormControlLabel value="female" control={<Radio />} label="Female" /> 
                                    </Box>   
                                </RadioGroup>
                            </FormControl>
                        <TextField sx={{maxWidth : 100}} type="number" name="age" label="Age" />
                    </Box>
                    <LoadingButton type="submit" variant="contained" loading={buttonLoading}>Submit</LoadingButton>
                </Stack>             
            </Grid>
                
            </Grid>
    <Footer />
    </>
    )
}

export default SignUp;