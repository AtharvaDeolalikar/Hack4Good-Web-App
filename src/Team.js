import { LoadingButton } from "@mui/lab"
import { Typography, TextField, Divider, Button, Grid, Stack, Chip, Box } from "@mui/material"
import { useContext, useState } from "react"
import { AuthContext } from "./Contexts/AuthContext"
import Footer from "./Footer"
import NavBar from "./Navbar"
import TeamManage from "./TeamManage"

function Team(){
    const context = useContext(AuthContext)
    const [load, setLoad] = useState(false)

    function createTeam(e){
        e.preventDefault()
        setLoad(true)
        if(!e.target.teamName.value){
            context.showAlert("error", "Please enter the team name")
            setLoad(false)
            return false
        }
        context.createTeam(e.target.teamName.value)
        setLoad(false)
    }

    function joinTeam(e){
        e.preventDefault()
        if(!e.target.teamID.value){
            context.showAlert("error", "Please enter the team ID")
            return false
        }
        context.navigate(`/team/join?teamID=${e.target.teamID.value}`)
    }

    return (
        <>
        <NavBar />
        {context.team ? 
        <TeamManage /> 
            : 
            <Box sx={{display: "flex", minHeight: "100vh"}}>
                <Grid container sx={{ textAlign: 'center', margin:"auto", justifyContent: "center" , pt:10, pb:{xs: 10, md: 20}}} maxWidth="md">
                    <Grid item xs={11} sx={{mb : 7}}> 
                        <Typography variant="h2" sx={{ fontSize: {xs: 40, sm: 45, md: "h2.fontSize"} , fontWeight: 500 }}>Hack4Good</Typography>
                        <Typography variant="p" color="#cacbcc">by IEEE CIS SBC - GHRCE</Typography>
                    </Grid>
                    <Grid item xs={11} md={5} sm={6} component="form" onSubmit={createTeam}>
                        <Stack spacing={3}>
                            <Typography variant="h5">
                                Create Team
                            </Typography>
                            <TextField
                                margin="normal"
                                id="email"
                                label="Team Name"
                                name="teamName"          
                            />
                            <LoadingButton loading={load} variant="outlined" type="submit">Create</LoadingButton>
                        </Stack>
                    </Grid>
                
                    <Grid item xs={11} md={2}  >
                        <Divider orientation="horizontal" sx={{py:5, display : {xs: "flex" , md: "none"}, maxWidth: 400, margin:"auto"}}>
                            <Chip label="OR" />
                        </Divider>
                        <Divider orientation="vertical" sx={{display : {xs: "none" , md: "flex"}}}>
                            <Chip label="OR" />
                        </Divider>
                    </Grid>
                
                    <Grid item xs={11} md={5} sm={6} component="form" onSubmit={joinTeam}>
                        <Stack spacing={3}>
                            <Typography variant="h5" >
                                Join Team
                            </Typography>
                            <TextField
                                margin="normal"
                                id="teamID"
                                label="Team ID"
                                name="teamID"
                            />
                            <Button variant="outlined" type="submit">Join</Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>}
        <Footer />
    </>
    )
}

export default Team