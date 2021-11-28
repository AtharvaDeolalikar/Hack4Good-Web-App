import { Search } from "@mui/icons-material"
import { CircularProgress, Button, Link, Stack, Chip, TableContainer, TableCell, TableHead, TableRow, Table, TableBody, Toolbar, AppBar, Typography, Input, TextField, InputAdornment, Dialog, DialogContent, DialogTitle,DialogContentText, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemIcon} from "@mui/material"
import { Box } from "@mui/system"
import Fuse from "fuse.js"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../Contexts/AuthContext"
//import Crown from "../../crown_icon.svg"
import { ReactComponent as Crown } from '../crown_icon.svg';

export default function Admin(){
    const context = useContext(AuthContext)
    const [teams, setTeams] = useState()
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState(null)
    const [submissionDialog, setSubmissionDialog] = useState({show: false, index: null})

    useEffect(() => {
        if(context.userData.isAdmin){
          async function fetchTeams(){
            var snapshot = await context.getAllTeams()
            setTeams(snapshot)
            console.log(snapshot)
            setLoading(false)
          }
          fetchTeams()
      }else{
        context.navigate("/profile")
      }
        
    }, [])

    const options = {
      // isCaseSensitive: false,
      // includeScore: false,
      // shouldSort: true,
      // includeMatches: false,
      // findAllMatches: false,
      // minMatchCharLength: 1,
      // location: 0,
      // threshold: 0.6,
      // distance: 100,
      // useExtendedSearch: false,
      // ignoreLocation: false,
      // ignoreFieldNorm: false,
      keys: [
        "teamName",
        "teamID",
        "id",
        "email"
      ]
    };
    
    const fuse = new Fuse(teams, options)
    
    function fuseSearch(e){
      if(e.target.value){
        var result = fuse.search(e.target.value)
        setSearch(result)
      }else{
        setSearch()
      }
    }

    function ShowSubmissionDialog(){
      var team = teams[submissionDialog.index]
      
      return (
        <Box>
          <Dialog open={submissionDialog.show} maxWidth="sm">
            <DialogTitle>Team {team.teamName}</DialogTitle>
            <DialogContent>
              <DialogContentText>
              <Typography color="white" fontSize={22}>{team.round1.projectTitle}</Typography>
              <Typography>{team.round1.projectDescription}</Typography>
              <Typography  color="white" mt={2}>Technologies Used</Typography>
              <Stack spacing={1} direction="row" >
                {team.round1.technologiesUsed.map(item => {
                  return <Chip key={item} label={item}/>
                })}
              </Stack>
              <Typography  color="white" mt={2}>Project Links</Typography>
              <Stack spacing={1}>
                {team.round1.projectLinks.map(item => (
                  <Link key={item} sx={{wordWrap: "break-word"}} href={item} target="_blank">{item}</Link>
                ))}
              </Stack>
              <Typography mt={2}>Last Updated at: {new Date(team.round1.lastUpdatedAt.seconds * 1000).toLocaleString('en-IN')}</Typography>
              </DialogContentText>
              <Button sx={{float: 'right'}} onClick={() => setSubmissionDialog({...submissionDialog, show: false})}>Close</Button>
            </DialogContent> 
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
              <TextField placeholder="Search" variant="standard" onChange={e => fuseSearch(e)} InputProps={{startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>)}}> 
              </TextField>
          </Toolbar>
          </AppBar>

          {submissionDialog.show && <ShowSubmissionDialog />}
          <TableContainer sx={{mt:8}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{fontSize : 18}}>Sr No</TableCell>
                  <TableCell sx={{fontSize : 18}}>Team Name</TableCell>
                  <TableCell sx={{fontSize : 18}}>Members</TableCell>
                  <TableCell sx={{fontSize : 18}}>Team ID</TableCell>
                  <TableCell align ="center" sx={{fontSize : 18}}>Round 1 Submission</TableCell>
                  <TableCell sx={{fontSize : 18}}>Round 2 Submission</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {(search ? search : teams).map((team, index) => (
                <TableRow key={index}>
                  <TableCell >{index + 1}</TableCell>
                  <TableCell >{team.teamName}</TableCell>
                  <TableCell >
                    <Stack spacing={2}>
                      {team.members.map((member, memberindex) => (
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
                  </TableCell>
                  <TableCell>{team.id}</TableCell>
                  <TableCell align ="center">{team.round1.submitted ? <Button onClick={() => setSubmissionDialog({index: index, show: true})}>Open</Button> : null}</TableCell>
                  <TableCell />
                </TableRow>
              ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
        }
            
        </>
    )
}