import { Box, Typography, Stack, TextField, FormControlLabel, FormLabel, RadioGroup, FormControl, Radio, Grid, InputLabel, Select, MenuItem, Dialog, DialogContentText, DialogTitle, DialogContent, Button } from "@mui/material"
import { useContext, useState } from "react";
import NavBar from "./Navbar"
import { AuthContext } from "./Contexts/AuthContext";
import { LoadingButton } from "@mui/lab";
import Footer from "./Footer";

function Profile(){
    const context = useContext(AuthContext);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [degreeType, setDegreeType] = useState(context.userData.degreeType || "")
    const [shirtSize, setShirtSize] = useState(context.userData.shirtSize || "")
    const [edit, setEdit] = useState({profile: false, address: false})
    const [addressConfirmation, setAddressConfirmation] = useState(!context.userData.addressConfirmation)
    const [addressDialog, setAddressDialog] = useState(false)
    const [userAddress, setUserAddress] = useState({})
    
    function ToggleButtonLoad(){
        setButtonLoading(buttonLoading => !buttonLoading)
    }

    function putAddress(e){
        e.preventDefault()
        if(!edit.address){
            setEdit({...edit, address: true})
            return false
        }
        const addressData = {
            addressLine1: e.target.addressLine1.value,
            addressLine2: e.target.addressLine2.value,
            landmark: e.target.landmark.value,
            city: e.target.city.value,
            pinCode: e.target.pinCode.value,
            state: e.target.state.value,
            shirtSize: e.target.shirtSize.value
        }
        for (const property in addressData) {
            console.log(e.target[property])
            if(addressData[property].length === 0){
                context.showAlert("error", `Please enter ${e.target[property].id}`)
                return false
            }
        }
        setUserAddress(addressData)
        setAddressDialog(true)   
    }

    async function addAddress(){       
        await context.addAddress({ ...userAddress, addressConfirmation: true})
        setAddressConfirmation(false)
        setAddressDialog(false)
    }

    async function updateProfile(e){
        e.preventDefault()
        if(!edit.profile){
            setEdit({...edit, profile: true})
            return false
        }
        ToggleButtonLoad()
        const detailsData = {
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
            ToggleButtonLoad()
            return false
        }
        for (const property in detailsData) {
            if(detailsData[property].length === 0){
              context.showAlert("error", `Please enter ${property}`)
              ToggleButtonLoad()
              return false
            } 
        }
        await context.updateUser(detailsData)
        ToggleButtonLoad()
        setEdit({...edit, profile: false})
    }

    return (
        <>
        <NavBar />
        <Grid container sx={{ mt:{xs:7, sm:8}, justifyContent : "space-evenly" }}>
            <Grid item xs={12}>
                <Typography variant="h4" align="center" my={2}>My Profile</Typography>
            </Grid>
            <Grid item md={4} sm={8} xs={11} my={2} component="form" onSubmit={updateProfile}>
                <Grid container spacing={3} >
                    <Grid item xs={12}>
                        <FormLabel component="legend">Basic Details</FormLabel>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            label="First Name"
                            disabled={!edit.profile}
                            defaultValue = {context.userData.firstName}
                            name= "firstName"        
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            label="Last Name"
                            fullWidth
                            name= "lastName"
                            disabled={!edit.profile}
                            defaultValue= {context.userData.lastName}     
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            name="email"
                            fullWidth
                            defaultValue = {context.userData.email}
                            disabled    
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Phone No"
                            name="phoneNo"
                            fullWidth
                            disabled={!edit.profile}
                            defaultValue = {context.userData.phoneNo}     
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Educational Institution"
                            name="institution" 
                            fullWidth
                            disabled={!edit.profile}
                            defaultValue = {context.userData.institution}       
                        />
                    </Grid>
                    <Grid item md={6} xs={12} >
                        <FormControl fullWidth>
                            <InputLabel disabled={!edit.profile}>Degree Type</InputLabel>
                            <Select 
                                value={degreeType} 
                                onChange={(e) => setDegreeType(e.target.value)}
                                defaultValue={context.userData.degreeType} 
                                label="Degree Type" 
                                name="degreeType" 
                                disabled={!edit.profile}
                            >
                                <MenuItem value="Associate">Associate</MenuItem>
                                <MenuItem value="Bachelors">Bachelors</MenuItem>
                                <MenuItem value="Masters">Masters</MenuItem>
                                <MenuItem value="Doctoral">Doctoral</MenuItem>
                                <MenuItem value="High School">High School</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            name = "studyField"
                            label="Field of Study"
                            placeholder = "Eg. Computer Science" 
                            disabled={!edit.profile}
                            defaultValue = {context.userData.institution}        
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <FormControl disabled={!edit.profile} sx={{border:"1 px solid"}}>
                            <FormLabel component="legend">Gender</FormLabel>
                            <RadioGroup
                                row
                                name="gender"
                                defaultValue={context.userData.gender}
                            >
                                <Box>
                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="female" control={<Radio />} label="Female" /> 
                                </Box>   
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4} sx={{textAlign: "right"}}>
                        <TextField sx={{maxWidth : 100}} disabled={!edit.profile} defaultValue={context.userData.age} type="number" name="age" label="Age" />
                    </Grid>
                    <Grid item xs={6} sx={{margin : "auto"}}>
                        <LoadingButton fullWidth size="large" loading={buttonLoading} type="submit" variant="contained" >{!edit.profile ? "Edit" : "Update"} Profile</LoadingButton>
                    </Grid> 
                </Grid>           
            </Grid>
            <Grid item md={4} sm={8} xs={11} my={2} component="form" onSubmit={putAddress}>
                <Dialog open={addressDialog} fullWidth={true} >
                    <DialogTitle>Shipping Details Confirmation</DialogTitle>
                    <DialogContent>
                        <DialogContentText >Do you really want to submit these shipping details? You won't be able to modify it later.</DialogContentText>
                        <Stack sx={{float: "right", mt: 2}} direction="row" spacing={2}>
                            <Button variant="contained" onClick={addAddress}>
                                Submit
                            </Button>

                            <Button variant="outlined" onClick={() => setAddressDialog(false)}>
                                Close
                            </Button>
                        </Stack>
                    </DialogContent>      
                </Dialog>
                <Grid container spacing={3} >
                    <Grid item xs={12}>
                        <FormLabel component="legend">Shipping Details</FormLabel>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Address Line 1"
                            name="addressLine1"
                            fullWidth
                            id="address line 1"
                            defaultValue={context.userData.addressLine1}
                            disabled={!(edit.address && addressConfirmation)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Address Line 2"
                            name="addressLine2"
                            fullWidth
                            id="address line 2"
                            defaultValue={context.userData.addressLine2}
                            disabled={!(edit.address && addressConfirmation)}   
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Landmark"
                            fullWidth
                            name="landmark"
                            id="the landmark"
                            defaultValue={context.userData.landmark}
                            disabled={!(edit.address && addressConfirmation)} 
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="City"
                            name="city"
                            id="city"
                            defaultValue={context.userData.city}
                            disabled={!(edit.address && addressConfirmation)}  
                        />
                    </Grid>
                    <Grid item md={6} xs={12} >
                        <TextField
                            fullWidth
                            type="number"
                            name="pinCode"
                            id="pincode"
                            defaultValue={context.userData.pinCode}
                            label="Pin Code"
                            disabled={!(edit.address && addressConfirmation)}   
                        />
                    </Grid>                    
                    <Grid item md={6} xs={12} >
                        <TextField
                            fullWidth
                            name="state"
                            label="State"
                            id="state"
                            defaultValue={context.userData.state}
                            disabled={!(edit.address && addressConfirmation)}   
                        />
                    </Grid>
                    <Grid item md={6} xs={12} >
                        <TextField
                            fullWidth
                            label="Country"
                            name="country"
                            defaultValue = "India"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <FormControl fullWidth disabled={!(edit.address && addressConfirmation)}>
                            <InputLabel >T-Shirt Size</InputLabel>
                            <Select 
                                value={shirtSize} 
                                onChange={(e) => setShirtSize(e.target.value)} 
                                label="T-Shirt Size" 
                                defaultValue={context.userData.shirtSize} 
                                name="shirtSize"
                                id="t-shirt size"
                            >
                                <MenuItem value="S">S</MenuItem>
                                <MenuItem value="M">M</MenuItem>
                                <MenuItem value="L">L</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} sx={{margin : "auto", mb:10, mt:1}}>
                        <Button fullWidth size="large" disabled={!addressConfirmation} type="submit" variant="contained" >{edit.address ? "Submit Shipping Details" : "Add Shipping Details"} </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid> 
        <Footer />
    </>
    )
}

export default Profile