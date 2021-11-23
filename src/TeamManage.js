import { Alert, Avatar, Button, Chip, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Stack, TextField, Tooltip, Typography } from "@mui/material"
import { useContext, useRef, useState } from "react"
import CopyToClipboard from "react-copy-to-clipboard"
import { AuthContext } from "./Contexts/AuthContext"
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { LoadingButton } from "@mui/lab"
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';

function TeamManage(){
    const context = useContext(AuthContext)
    console.log(context)
    const [button, setButton] = useState(false);
    const teamNameRef = useRef();
    const [inviteDiag, setInviteDiag] = useState(false)
    const [editDiag, setEditDiag] = useState(false)

    async function handleClick(){
        setButton(true)
        await context.updateTeam(teamNameRef.current.value)
        setButton(false)
        setEditDiag(false)
    }

    return (
        <>
            <Grid container sx={{ mt : {xs: 5, md: 11}, bgcolor : "#0a1929"}}> 
                <Grid item md={7} sm={8} xs={11} sx={{ p:3, borderRadius: 5, bgcolor: "#162534", margin:"auto", py: {xs: 5, md: 8}, my:5, display: "flex", justifyContent: "space-between"}}>
                    <Typography sx={{fontSize: {xs: 30, md: 45}}}>{context.team.teamName}</Typography>
                    <EditIcon sx={{mt: {xs:1 , md:2},  cursor: "pointer"}} onClick={() => setEditDiag(true)}/>
                </Grid>
                <Dialog open={editDiag} fullWidth={true} maxWidth="xs">
                    <DialogTitle>Edit Team Name</DialogTitle>
                    <DialogContent sx={{textAlign: "center"}}>
                        <Stack spacing={2}>
                            <TextField
                                defaultValue = {context.team.teamName}
                                margin="normal"
                                inputRef={teamNameRef}
                            >
                            </TextField>
                            <LoadingButton loading={button} variant="outlined" onClick={handleClick}>Update</LoadingButton>
                        </Stack>
                    </DialogContent>
                </Dialog>
            </Grid>
            <Grid container sx={{display: "flex", justifyContent: "center", bgcolor : "#0a1929", mb: 12}}>
                <Grid item md ={4} sm={8} xs={11}>
                    <Chip sx={{fontSize: {xs: 20, md: 20}, p:3}} label="Team Members"></Chip>
                    <List >
                        {context.team.members.map((member) => {
                            return (
                                <ListItem key={member.uid} disableGutters>
                                    <ListItemAvatar>
                                        <Avatar sx={{bgcolor : "primary.main"}}>{member.name.charAt(0)}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={member.name}
                                        secondary={member.emailID}
                                    />
                                </ListItem>
                            )
                        }) }
                    </List>
                </Grid>
            
                <Grid item md={3} sm={8} xs={11}>
                    <Alert sx={{borderRadius:3, my:2}} severity="info">Hack4Good let’s you have upto 4 teammates. You can invite people to join your team by clicking the button below.</Alert>
                    <Button size="large" fullWidth  variant="outlined" onClick={() => setInviteDiag(true)}>Invite people</Button> 
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
                            <Button sx={{float: "right"}} variant="outlined" onClick={() => setInviteDiag(false)}>
                                Close
                            </Button> 
                        </DialogContent>      
                    </Dialog>
                </Grid>
            </Grid>
        </>
    )
}

export default TeamManage;