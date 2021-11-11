import {Box, TextField, Typography, Stack, Button, Divider, FormLabel, InputAdornment, IconButton, Select, Chip, InputLabel, FormControl, CircularProgress} from "@mui/material"
import { useContext, useEffect, useRef, useState } from "react"
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import { AuthContext } from "../Contexts/AuthContext";
import DeleteIcon from '@mui/icons-material/Delete';
import OutlinedInput from '@mui/material/OutlinedInput';
import Timer from "../Timer";
import Temp from "../temp";


function Round1(){
    const context = useContext(AuthContext) 
    const [noLinks, setNoLinks] = useState(["link"])
    const [technologies, setTechnologies] = useState([])
    const [start, setStart] = useState( false)
    const [timer, setTimer] = useState()

    useEffect(() => {
        setInterval(function(){ 
            setTimer(Timer("Nov 15, 2021 23:59:59 GMT+0530"))
            //console.log(timer)
        }, 1000);
    }, [])
    

    const names=[
        "JavaScript",
        "HTML",
        "CSS",
        "React", 
        "React Native",
        "Angular",
        "flutter",
        "NPM",
        "Vue.js",
        "Ionic", 
        "BootStrap"
    ]

    const projectTitleRef = useRef()
    const projectDescriptionRef = useRef()

    function addLink(){
        if(noLinks.length === 5){
            context.showAlert("error", "You can add upto 5 links.")
            return false
        }
        setNoLinks(noLinks => [...noLinks, "Link"])
    }

    function deleteLink(index){
        const temp = [...noLinks]
        temp.splice(index, 1)
        setNoLinks(temp)
    }

    
    const handleTechChange = (event) => {
        const {
        target: { value },
        } = event;
        setTechnologies(
        // On autofill we get a the stringified value.
        typeof value === 'string' ? value.split(',') : value,
        );
    };

    
    return (
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight : "75vh", width : "100%"}}>     
            <Box my={3}>
                {start ? 
                <Stack>
                    <Typography variant="h3" fontSize={{xs: 30, sm:35, md: 45}}>Round - 1 Submission</Typography>
                    <Box sx={{ my: 4, mx: {xs: 1, md: 0}}}>
                        <Stack spacing={2}>
                            <FormLabel component="legend">Basic Details</FormLabel>
                            <TextField inputRef={projectTitleRef} label="Project Title" required></TextField>
                            <TextField inputRef={projectDescriptionRef} label= "Project Description" required multiline minRows={4} maxRows={6}> </TextField>
                            <Divider sx={{m:2}}/>
                            <FormLabel component="legend">Project Details</FormLabel>
                            
                            <FormControl >
                            <InputLabel id="demo-multiple-chip-label" sx={{bgcolor:"#162534", pr:0.7}}>Technologies Used</InputLabel>
                            <Select
                                multiple
                                value={technologies}
                                onChange={handleTechChange}
                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                    </Box>
                                )}
                                //MenuProps={MenuProps}
                            >
                                {names.map((name) => (
                                <MenuItem
                                  key={name}
                                  value={name}
                                  //style={getStyles(name, personName, theme)}
                                >
                                  {name}
                                </MenuItem>
                              ))}
                            </Select>
                            </FormControl>

                            {noLinks.map((item, index) => 
                                <TextField 
                                    label={`Link #${index + 1}`} 
                                    defaultValue={context.team ? item : ""}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end"><IconButton onClick={() => deleteLink(index)}><DeleteIcon /></IconButton></InputAdornment>,
                                    }}
                                ></TextField>
                            )}
                            <Button onClick={() => addLink()} startIcon={<AddIcon />}>Add link</Button>
                            <Button variant="contained">{context.team ? "Update" : "Submit"}</Button>
                        </Stack>
                    </Box>
                </Stack> : 

                <>{timer ?
                    <Box sx={{textAlign: "center"}}>
                        <Stack spacing={1}>
                            <Typography sx={{fontSize: {xs:22, sm: 30}}}>Time left for Round - 1 Submission</Typography>
                            <Temp time={timer}/>
                              <Box>  
                            <Button variant="outlined"  sx={{minWidth: 200}} onClick={() => {setStart(true)}}>Start</Button> </Box>
                        </Stack>
                    </Box>  : <CircularProgress />}
                </>
                
                }
            </Box>
        </Box>
    )
}

export default Round1