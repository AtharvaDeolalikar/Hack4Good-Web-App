import { Alert, Chip, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useContext, useRef, useState } from "react"
import CopyToClipboard from "react-copy-to-clipboard"
import { AuthContext } from "./Contexts/AuthContext"
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { LoadingButton } from "@mui/lab"

function TeamManage(){
    const context = useContext(AuthContext)
    const [buttonLoading, setButtonLoading] = useState(false);
    const teamNameRef = useRef();

    async function handleClick(){
        setButtonLoading(true)
        await context.updateTeam(teamNameRef.current.value)
        setButtonLoading(false)
    }

    return (
        <Box sx={{display: "flex", justifyContent: "space-evenly", flexWrap: "wrap", alignItems: "center", width : "100%", minHeight: "80vh", textAlign: "center" , my:7 }}>      
            <Box>
                <Chip sx={{fontSize: {xs: 17, md: 22}, p:3.5 , my:2}} label={`Team: ${context.team.teamName}`}></Chip> 
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
                

            <Box>
                <Divider orientation="vertical" sx={{height: 300, display:{xs: "none", sm:"block" } }} flexItem ></Divider>
                <Divider orientation="horizontal" sx={{width:300, my:6, display:{sm: "none", xs:"block" } }} flexItem ></Divider>
            </Box>

            <Stack sx={{display: "inline-block"}}>
                <Typography >Team Members </Typography>

            {context.team.members.map((item, index) => {
                var currentIndex = (index + 1 ).toString() + ". "
                return (
                    <> 
                        <Chip key={item.uid} sx={{ fontSize: 17, p:3, my:1}} variant="outlined" label={currentIndex + item.name}></Chip> <br />
                    </>
                )
            }) }
                
            </Stack>

            <Box>
                <Divider orientation="vertical" sx={{height: 300, display:{xs: "none", sm:"block" } }} flexItem ></Divider>
                <Divider orientation="horizontal" sx={{width:300, my:6, display:{sm: "none", xs:"block" } }} flexItem ></Divider>
            </Box>

            <Box width={350} >
                <Stack sx={{width: 1}} spacing={3}>
                <Typography variant="h5" align="center">Update Team</Typography>
                    <TextField
                        margin="normal"
                        id="TeamName"
                        label="Team Name"
                        defaultValue= {context.team.teamName}
                        name= "TeamName"
                        inputRef={teamNameRef}          
                    />
                    <LoadingButton loading={buttonLoading} variant="outlined" onClick={handleClick} size="large">Update</LoadingButton>
                </Stack> 
            </Box>
        </Box>
    )
}

export default TeamManage;