import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, InputAdornment, Stack, TextField, Tooltip, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useContext, useRef, useState } from "react"
import CopyToClipboard from "react-copy-to-clipboard"
import { AuthContext } from "./Contexts/AuthContext"
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { LoadingButton } from "@mui/lab"
import LinkIcon from '@mui/icons-material/Link';

function TeamManage(){
    const context = useContext(AuthContext)
    const [button, setButton] = useState({editable : false, loading: false});
    const teamNameRef = useRef();
    const [inviteDiag, setInviteDiag] = useState(false)

    async function handleClick(){
        setButton({...button, loading: true})
        if(!button.editable){
            setButton({...button, editable: true})
            return false
        }
        await context.updateTeam(teamNameRef.current.value)
        setButton({loading: false, editable: false})
    }

    return (
        <Box sx={{display: "flex", justifyContent: "space-evenly", flexWrap: "wrap", alignItems: "center", width : "100%", minHeight: "85vh", textAlign: "center" , my:7 , py:3}}>      
            <Box>
                <Chip sx={{fontSize: {xs: 17, md: 22}, p:3.5 , my:2}} label={`Team : ${context.team.teamName}`}></Chip> 
                <Alert sx={{borderRadius:3,  maxWidth: 380, my:2}} severity="info">Hack4Good let’s you have upto 4 teammates. You can invite people to join your team by clicking the button below.</Alert>
                 
                <Button size="large" fullWidth variant="outlined" onClick={() => setInviteDiag(true)}>Invite people</Button> 
                
                <Dialog open={inviteDiag} fullWidth={true} >
                    <DialogTitle>Invite people to join your team</DialogTitle>
                    <DialogContent>
                        <DialogContentText color="white" sx={{mt:2}}>1. Share the team invite link</DialogContentText>
                            <CopyToClipboard
                                options={{ debug: true, message: "" }}
                                text={`https://hack4good.ieee-cis-sbc.org/team/join?teamID=${context.userData.teamID}`}
                                onCopy={() => context.showAlert("success", "Team invite link has been copied to Clipboard!")}>
                                <Tooltip title="Copy the team invite link and share it with your teammates!" arrow> 
                                    <TextField 
                                        defaultValue={`https://hack4good.ieee-cis-sbc.org/team/join?teamID=${context.userData.teamID}`}
                                        disabled
                                        sx={{mt:1, mb:3}}
                                        fullWidth
                                        InputProps={{
                                            endAdornment: 
                                            <InputAdornment position="end">
                                                    <IconButton >
                                                        <LinkIcon />
                                                    </IconButton>
                                            </InputAdornment>
                                        }}
                                        
                                    ></TextField>
                                </Tooltip>
                            </CopyToClipboard>

                        <Divider orientation="horizontal"><Chip label="Or" /></Divider>

                        <DialogContentText sx={{mt:2}} color="white">2. Share the team code </DialogContentText>
                        
                            <CopyToClipboard
                                options={{ debug: true, message: "" }}
                                text={context.userData.teamID}
                                onCopy={() => context.showAlert("success", "Team ID has been copied to Clipboard!")}>
                                    <Tooltip title="Copy the team code and share it with your teammates" arrow> 
                                        <TextField 
                                            defaultValue={context.userData.teamID}
                                            sx={{mt:1, mb:3}}
                                            disabled
                                            fullWidth
                                            InputProps={{
                                                endAdornment: <Tooltip title="Copy" arrow><InputAdornment position="end"><IconButton ><ContentCopyIcon /></IconButton></InputAdornment></Tooltip>
                                            }}
                                        ></TextField>
                                    </Tooltip>
                            </CopyToClipboard>
                       
                        <DialogActions >
                            <Button variant="outlined" onClick={() => setInviteDiag(false)}>
                                Done
                            </Button> 
                        </DialogActions>
                    </DialogContent>      
                </Dialog>
            </Box>
                

            <Box>
                <Divider orientation="vertical" sx={{height: 300, display:{xs: "none", sm:"block" } }} flexItem ></Divider>
                <Divider orientation="horizontal" sx={{width:300, my:6, display:{sm: "none", xs:"block" } }} flexItem ></Divider>
            </Box>

            <Box >
                <Chip sx={{fontSize: {xs: 17, md: 22}, p:3.5 , my:2}} label="Team Members"></Chip>
                   <Stack sx={{textAlign: 'left'}} spacing={1}>                     
                    {context.team.members.map((item, index) => {
                        return (
                            <Typography key={index} sx={{fontSize: {xs: 16, md: 19}}}>{(index + 1 ).toString() + ". " + item.name}</Typography>
                        )
                    }) }
                    </Stack>
                
            </Box>

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
                        disabled = {!button.editable}
                        defaultValue= {context.team.teamName}
                        name= "TeamName"
                        inputRef={teamNameRef}          
                    />
                    <LoadingButton loading={button.loading} variant="outlined" onClick={handleClick} size="large">{button.editable ? "Update" : "Edit"}</LoadingButton>
                </Stack> 
            </Box>
        </Box>
    )
}

export default TeamManage;