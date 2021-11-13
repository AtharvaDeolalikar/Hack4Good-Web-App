import { Typography, TextField, Divider, Button, Grid, Stack, Chip, Box } from "@mui/material"
import { useContext, useRef } from "react"
import { AuthContext } from "./Contexts/AuthContext"
import Footer from "./Footer"
import NavBar from "./Navbar"
import TeamManage from "./TeamManage"


function Team(){
    const context = useContext(AuthContext) 
    const createTeamNameRef= useRef()
    const joinTeamIDRef= useRef()

    //console.log(countdown( Date.now(), new Date(2021, 10, 15)).toString() )

    return (
        <>
        <NavBar />
        {context.team ? <TeamManage /> :
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight : "75vh", width : "100%" , my: 7}}>        
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>   
                <Grid container sx={{textAlign: 'center'}}>
                    <Grid item xl={12} xs={12} sx={{mb : 7, mt: {xs: 3, md: 0}}}> 
                        <Typography variant="h2" sx={{ fontSize: {xs: 35, md: "h2.fontSize"} , fontWeight: 500 }}>Hack4Good</Typography>
                        <Typography variant="p" color="#cacbcc">by IEEE CIS SBC - GHRCE</Typography>
                    </Grid>
                    <Grid item xl={5} xs={12}  mb={4} md={5} m={{xs: 2, md: 0}}>
                        <Stack spacing={3}>                
                            <Typography variant="h5" >
                                Create Team
                            </Typography>
                            <TextField
                                margin="normal"
                                id="email"
                                label="Team Name"
                                name="TeamName" 
                                inputRef={createTeamNameRef}             
                            />
                            <Button variant="outlined" onClick={() => context.createTeam(createTeamNameRef.current.value)}>Create</Button>
                        </Stack>
                    </Grid>
                
                    <Grid item xl={2} xs={12}  md={2} >
                        <Divider orientation="vertical"><Chip label="OR"></Chip>
                        </Divider>
                    </Grid>
                
                    <Grid item xl={5} xs={12}  mb={4} md={5} m={{xs: 2, md: 0}}>
                        <Stack spacing={3}>
                            <Typography variant="h5" >
                                Join Team
                            </Typography>
                            <TextField
                                margin="normal"
                                id="teamID"
                                label="Team ID"
                                name="teamID"
                                inputRef = {joinTeamIDRef}
                            />
                            
                            <Button variant="outlined" onClick={() => context.joinTeam(joinTeamIDRef.current.value)}>Join</Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Box>}
        <Footer />
    </>
    )
}

export default Team