import {Box, TextField, Typography, Stack, Button, Divider, FormLabel, InputAdornment, IconButton, Select, Chip, InputLabel, FormControl, CircularProgress} from "@mui/material"
import { useContext, useEffect, useRef, useState } from "react"
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import { AuthContext } from "../Contexts/AuthContext";
import DeleteIcon from '@mui/icons-material/Delete';
import OutlinedInput from '@mui/material/OutlinedInput';
import Timer from "../Timer";
import Temp from "../temp";
import DynamicButton from "../DynamicButton";


function Round1(){
    const context = useContext(AuthContext) 
    //console.log(context.team.round1)
    const isSubmitted = context.team.round1.submitted
    const [noLinks, setNoLinks] = useState((isSubmitted && context.team.round1.projectLinks) || [""])
    const [technologies, setTechnologies] = useState((isSubmitted && context.team.round1.technologiesUsed) || [])
    const [start, setStart] = useState(isSubmitted)
    const [timer, setTimer] = useState()
    const [editable, setEditable] = useState(false)

    const projectTitleRef = useRef()
    const projectDescriptionRef = useRef()

    useEffect(() => {
        var deadline = new Date("Nov 18, 2021 19:15:00 GMT+0530").getTime();
        var current = new Date().getTime();
        const interval = setInterval(function(){
            current = current + 1000
            setTimer(Timer(deadline, current))
            //console.log(timer)
        }, 1000);
        return () => {
            clearInterval(interval)
        }
    }, [])

    async function MakeSubmission(){
        console.info(technologies, noLinks)
        if(timer.expired){
            //console.log("timer expired")
            return false
        }
        if(!editable){
            setEditable(true)
            return false
        }
        const round1data = {
            projectTitle: projectTitleRef.current.value,
            projectDescription : projectDescriptionRef.current.value,
            technologiesUsed : technologies,
            projectLinks: noLinks
        }

        for (const property in round1data) {
            if(round1data[property].length === 0){
              context.showAlert("error", `Enter ${property} first!`)
              return false
            } 
        }
        for (var link = 0; link< noLinks.length; link++){
            if(noLinks[link].length === 0){
                context.showAlert("error", "Enter the link(s) before submission.")
                return false
            }
        }
        await context.Round1Submission(round1data)
        setEditable(false)
    }
    

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

    

    function addLink(){
        if(noLinks.length === 5){
            context.showAlert("error", "You can add upto 5 links.")
            return false
        }
        setNoLinks(noLinks => [...noLinks, ""])
    }

    function deleteLink(index){
        const temp = [...noLinks]
        temp.splice(index, 1)
        setNoLinks(temp)
    }

    function updateLinksArray(index, value){
        var tempArray = noLinks
        tempArray[index] = value
        setNoLinks(tempArray)
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

    if(!timer){
        return(
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight : "85vh", width : "100%"}}>
                <CircularProgress />
            </Box>
        )
    }


    
    return (
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight : "80vh", width : "100%" , mb:4}}>     
            <Box my={3}>
                {start ? 
                <Stack>
                    <Typography variant="h3" textAlign="center" fontSize={{xs: 30, sm:35, md: 45}}>Round - 1 Submission</Typography>
                    <Box sx={{ my: 4, mx: {xs: 1, md: 0}}}>
                        <Stack spacing={2}>
                            <FormLabel component="legend">Basic Details</FormLabel>
                            <TextField 
                                inputRef={projectTitleRef } 
                                label="Project Title" 
                                disabled={!(!timer.expired && editable)}
                                defaultValue = {isSubmitted ? context.team.round1.projectTitle : ""}
                            >
                            </TextField>
                            <TextField 
                                inputRef={projectDescriptionRef} 
                                label= "Project Description" 
                                multiline 
                                minRows={4} 
                                maxRows={6}
                                disabled={!(!timer.expired && editable)}
                                defaultValue = {isSubmitted ? context.team.round1.projectDescription : ""}
                            >
                            </TextField>
                            <Divider sx={{m:2}}/>
                            <FormLabel component="legend">Project Details</FormLabel>
                            
                            <FormControl >
                            <InputLabel id="demo-multiple-chip-label" sx={{bgcolor:"#162534", pr:0.7}}>Technologies Used</InputLabel>
                            <Select
                                multiple
                                disabled={!(!timer.expired && editable)}
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
                                    defaultValue={isSubmitted ? item : ""}
                                    disabled={!(!timer.expired && editable)}
                                    onChange= {(event) => updateLinksArray(index, event.target.value)}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end"><IconButton  disabled={!(!timer.expired && editable)} onClick={() => deleteLink(index)}><DeleteIcon /></IconButton></InputAdornment>,
                                    }}
                                ></TextField>
                            )}
                            <Button disabled={!(!timer.expired && editable)} onClick={() => addLink()} startIcon={<AddIcon />}>Add link</Button>
                            <DynamicButton timer={timer} editable={editable} MakeSubmission={MakeSubmission} />
                            {/* {timer.expired && <Button variant="contained" disabled>{"Submission deadline is over" }</Button>}
                        

                            {editable && !timer.expired &&
                            <Button variant="contained" onClick={MakeSubmission}>{isSubmitted ? "Update Submission" : "Submit"}</Button> } */}
                            {/* <Button variant="contained" onClick={MakeSubmission}>{isSubmitted ? "Edit Submission" : "Submit"}</Button>  */}
                        </Stack>
                    </Box>
                </Stack> : 

                <>
                {!isSubmitted && timer &&
                    <Box sx={{textAlign: "center"}}>
                        <Stack spacing={1}>
                            <Typography sx={{fontSize: {xs:22, sm: 30}}}>Time left for Round - 1 Submission</Typography>
                            <Temp time={timer}/>
                              <Box>  
                            <Button variant="outlined" disabled={timer.expired} sx={{minWidth: 200}} onClick={() => {setStart(true)}}>{timer.expired ?  "Submission Deadline is over" : "Start"}</Button> </Box>
                        </Stack>
                    </Box> }
                </>
                
            }
            </Box>
        </Box>
    )
}

export default Round1