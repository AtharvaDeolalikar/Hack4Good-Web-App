import { Search } from "@mui/icons-material"
import { CircularProgress, Button, Link, Stack, Collapse, Chip, Toolbar, AppBar, Typography, TextField, InputAdornment, Dialog, DialogContent, DialogTitle,DialogContentText, ListItem, ListItemText, ListItemIcon, Grid, IconButton, Tooltip} from "@mui/material"
import { Box } from "@mui/system"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../Contexts/AuthContext"
import { TransitionGroup } from 'react-transition-group';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Admin(){
    const context = useContext(AuthContext)
    const [teams, setTeams] = useState()
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [submissionDialog, setSubmissionDialog] = useState({show: false, index: null})

    useEffect(() => { 
      async function fetchTeams(){
        var snapshot = await context.getAllTeams()
        setTeams(snapshot)
        setLoading(false)
      }
      fetchTeams()
      //context.showAlert("error", "You are not authorised to access this page")
      //context.navigate("/profile") 
    }, [context])

    function makeSearch(item){
      function searchHelper(item){
        if (item.toLowerCase().includes(search)) return true 
      }
      if (search === ""){
        return item
      }else if(searchHelper(item.id)){
        return item
      }else if(searchHelper(item.teamName)){
        return item
      }
      for (var member=0; member < item.members.length ; member++){
        if (searchHelper(item.members[member].emailID)) return item
        
      }
    }

    function ShowSubmissionDialog(){
      var team = teams[submissionDialog.index]

      return (
        <Box>
          <Dialog open={submissionDialog.show} maxWidth="md">
            <Box sx={{bgcolor : "#162534"}}>
            <DialogTitle >Team {team.teamName}</DialogTitle>
            <DialogContent>
              <DialogContentText>
              <Typography color="white" fontSize={22}>{team.round1.projectTitle}</Typography>
              <Typography>{team.round1.projectDescription}</Typography>
              <Typography  color="white" mt={2}>Technologies Used</Typography>
              <Stack direction="row" sx={{flexWrap: "wrap", gap:1, mt:1, mb: 2}}>
                {team.round1.technologiesUsed.map(item => (
                  <Chip key={item} label={item}/>
                ))}
              </Stack>
              <Typography color="white" mt={2}>Project Links</Typography>
              <Stack spacing={1}>
                {team.round1.projectLinks.map(item => (
                  <Link key={item} sx={{wordWrap: "break-word"}} href={item} target="_blank">{item}</Link>
                ))}
              </Stack>
              <Typography mt={2}>Last Updated at: {new Date(team.round1.lastUpdatedAt.seconds * 1000).toLocaleString('en-IN')}</Typography>
              </DialogContentText>
              <Button sx={{float: 'right'}} onClick={() => setSubmissionDialog({...submissionDialog, show: false})}>Close</Button>
            </DialogContent> 
            </Box>
          </Dialog>
        </Box>
      )
    }    

    return (
        <>
        {loading ? 
        <Box sx={{minHeight: "100vh", display: "flex", justifyContent : "center", alignItems: "center"}}>
          <CircularProgress />
        </Box>
          :
          <>
          <AppBar
            position="fixed"
            color="default"
            elevation={0}
            sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
          >
          <Toolbar sx={{ flexWrap: 'wrap', display: "flex", justifyContent : "space-between" }}>
            <Typography>Hack4Good</Typography>
              <Box sx={{display: "flex", gap: 2}}>
                <Tooltip title="You can search by team ID, team name or the email address of any team member!">
                  <TextField placeholder="Search" variant="standard" onChange={e => setSearch(e.target.value.toLowerCase())} InputProps={{startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>)}}> 
                  </TextField>
                </Tooltip>
                <Tooltip title="Log out">
                  <IconButton onClick={() => context.logOut()}><LogoutIcon /></IconButton>
                </Tooltip>
              </Box>
          </Toolbar>
          </AppBar>
          {submissionDialog.show && <ShowSubmissionDialog />}
          <Box sx={{mt: 9,  bgcolor : "#0a1929"}}>
            <Box sx={{display: 'flex'}}>
              <Grid container columnSpacing={3} sx={{ px: 4, py:2,  bgcolor: "#162534", my: 2, borderRadius: 3, mx: 5, alignItems: "center",  border: (theme) => `1px solid ${theme.palette.divider}`}}>
                  <Grid item md={1}>Sr No</Grid>
                  <Grid item md={2}>Team Name</Grid>
                  <Grid item md={4}>Members</Grid>
                  <Grid item md={2}>Team ID</Grid>
                  <Grid item md={2} sx={{textAlign : "center"}}><Chip color="info" label="Round 1 Submission" /></Grid>
              </Grid>
            </Box>
            <TransitionGroup >
              {teams.filter(item => {
                return makeSearch(item)
                }).map((team, index) => {
                  return (
                    <Collapse in={true} key={index}>
                      <Box sx={{display : "flex"}}>
                        <Grid container columnSpacing={3} sx={{ p: 4, bgcolor: "#162534", my: 2, borderRadius: 3, mx: 5, alignItems: "center"}}>
                          <Grid item md={1}>{index + 1}</Grid>
                          <Grid item md={2}>{team.teamName}</Grid>
                          <Grid item md={4}>
                            <Stack spacing={2}>
                              {team.members.map((member) => (
                                  <ListItem key={member.uid} disableGutters>
                                  <ListItemText
                                      primary={member.firstName + " " + member.lastName}
                                      secondary={member.emailID}
                                  />
                                  {member.teamLeader && 
                                  <ListItemIcon>
                                    <Chip label="Team Leader" />
                                  </ListItemIcon>}
                              </ListItem>
                              ))}
                            </Stack>
                          </Grid>
                          <Grid item md={2}>{team.id}</Grid>
                          <Grid item md={2} sx={{textAlign : "center"}}>
                            {team.round1.submitted ? <Button variant="outlined" onClick={() => setSubmissionDialog({index: index, show: true})}>Open</Button> : null}
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>               
                )})}
            </TransitionGroup>
          </Box>
        </>
        }
            
        </>
    )
}