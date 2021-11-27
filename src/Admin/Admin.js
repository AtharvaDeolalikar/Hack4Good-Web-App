import { Search, ViewAgenda } from "@mui/icons-material"
import { CircularProgress, Tab, Tabs, Stack, TableContainer, TableCell, TableHead, TableRow, Table, TableBody, Toolbar, AppBar, Typography, Input, TextField, InputAdornment } from "@mui/material"
import { Box } from "@mui/system"
import Fuse from "fuse.js"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../Contexts/AuthContext"

export default function Admin(){
    const context = useContext(AuthContext)
    const [users, setUsers] = useState()
    const [teams, setTeams] = useState()
    const [loading, setLoading] = useState(true)
    const [value, setValue] = useState(0)
    const [search, setSearch] = useState(null)

    useEffect(() => {
        if(context.userData.isAdmin){
          async function fetchUsers(){
            var snapshot = await context.getAllUsers()
            setUsers(snapshot)
            console.log(snapshot)
            
          }
          async function fetchTeams(){
            var snapshot = await context.getAllTeams()
            setTeams(snapshot)
            console.log(snapshot)
            setLoading(false)
          }
          fetchUsers()
          fetchTeams()
      }else{
        context.navigate("/profile")
      }
        
    }, [])

    const userColumns = [
        { field: 'id', headerName: 'ID', width: 250 },
        { field: 'firstName', headerName: 'First name', width: 130 },
        { field: 'lastName', headerName: 'Last name', width: 130 },
        { field: 'gender', headerName: 'Gender', width: 100 },
        { field: 'institution', headerName: 'Institution', width: 130 },
        { field: 'age', headerName: 'Age', type: 'number', width: 80},
        { field: 'phoneNo', headerName: 'Phone No', type: 'number', width: 150},
        { field: 'email', headerName: 'Email ID', width: 350 }
    ];

    const teamColumns = [
      { field: 'id', headerName: 'ID', width: 250 },
      { field: 'mebers', headerName: 'Members', width: 250 , 
        renderCell: (params) => (
          //console.log(params)
          <Box sx={{display: "flex", flexDirection : "column"}}>
              <Box>{params.row.members[0].name}</Box>
              <Box>{params.row.members[1].name}</Box>
              <Box>{params.row.members[1].name}</Box>
          </Box>
            //params.row.members[0].name
        ) 
      }
        
    ]

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
    
    const fuse = new Fuse(value==0 ? teams: users, options)
    
    function fuseSearch(e){
      if(e.target.value){
        var result = fuse.search(e.target.value)
        setSearch(result)
      }else{
        setSearch()
      }
      console.log(search)
    }


    return (
        <>
        <Box minHeight="100vh">
          <AppBar
            position="fixed"
            color="default"
            elevation={0}
            sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
          >
          <Toolbar sx={{ flexWrap: 'wrap', display: "flex", justifyContent : "space-between" }}>
            <Typography>Hack4Good Admin</Typography>
              <TextField placeholder="Search" variant="standard" onChange={e => fuseSearch(e)} InputProps={{startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>)}}> 
              </TextField>
          </Toolbar>
          </AppBar>
          <Tabs value={value} onChange={handleChange} sx={{ borderBottom: 1, mt:8, borderColor: 'divider'}}>
            <Tab label="Teams"/>
            <Tab label="Users"/>
          </Tabs>
        
        {loading ? 
        <CircularProgress />
          :
        <TableContainer>
          <Table>
            {value == 0 ?
            <>
            <TableHead>
              <TableRow>
                <TableCell>Sr No</TableCell>
                <TableCell>Team Name</TableCell>
                <TableCell>Members</TableCell>
                <TableCell>Team ID</TableCell>
                <TableCell>Round 1</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {(search ? search : teams).map((team, index) => (
              <TableRow>
                <TableCell >{index + 1}</TableCell>
                <TableCell >{team.teamName}</TableCell>
                <TableCell >
                  <Stack spacing={2}>
                  {team.members.map((member) => (
                      <Box>
                        {member.name}
                      </Box>
                  ))}
                  </Stack>
                </TableCell>
                <TableCell>{team.id}</TableCell>
                <TableCell>{team.round1.submitted ? <ViewAgenda /> : "N"}</TableCell>
              </TableRow>
            ))}
            </TableBody>
            </>
           : 
           <>
            <TableHead>
              <TableRow>
                <TableCell sx={{minWidth : 80}}>Sr No</TableCell>
                <TableCell sx={{minWidth : 150}}>First Name</TableCell>
                <TableCell sx={{minWidth : 150}}>Last Name</TableCell>
                <TableCell sx={{minWidth : 150}}>Email ID</TableCell>
                <TableCell sx={{minWidth : 150}}>Phone No</TableCell>
                <TableCell sx={{minWidth : 150}}>Degree Type</TableCell>
                <TableCell sx={{minWidth : 150}}>Field of Study</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Institution</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {search ? <>
            {search.map((search, index) => (
              <TableRow>
                <TableCell>{index + 1}</TableCell>
                <TableCell >{search.item.firstName}</TableCell>
                <TableCell >{search.item.lastName}</TableCell>
                <TableCell >{search.item.email}</TableCell>
                <TableCell >{search.item.phoneNo}</TableCell>
                <TableCell >{search.item.degreeType}</TableCell>
                <TableCell >{search.item.studyField}</TableCell>
                <TableCell>{search.item.id}</TableCell>
                <TableCell>{search.item.age}</TableCell>
                <TableCell>{search.item.gender}</TableCell>
                <TableCell>{search.item.institution}</TableCell>                
              </TableRow>
            ))}</> :
            <>
            {users.map((user, index) => (
              <TableRow>
                <TableCell>{index + 1}</TableCell>
                <TableCell >{user.firstName}</TableCell>
                <TableCell >{user.lastName}</TableCell>
                <TableCell >{user.email}</TableCell>
                <TableCell >{user.phoneNo}</TableCell>
                <TableCell >{user.degreeType}</TableCell>
                <TableCell >{user.studyField}</TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.age}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.institution}</TableCell>                
              </TableRow>
            ))}
            </>}

            </TableBody>
            </>
          }
          </Table>
        </TableContainer>
        }
        </Box>
            
        </>
    )
}