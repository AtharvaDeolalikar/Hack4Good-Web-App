import {Box, TextField, Typography, Stack, Button, FormLabel, Grid, InputAdornment, IconButton, Select, Chip, InputLabel, FormControl, CircularProgress} from "@mui/material"
import { useContext, useEffect, useRef, useState } from "react"
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import { AuthContext } from "../Contexts/AuthContext";
import DeleteIcon from '@mui/icons-material/Delete';
import OutlinedInput from '@mui/material/OutlinedInput';
import Timer from "../Timer";
import Temp from "../temp";
import DynamicButton from "../DynamicButton";
import { TransitionGroup } from 'react-transition-group';
import Collapse from '@mui/material/Collapse'

function Round1(){
    const context = useContext(AuthContext) 
    //console.log(context.team.round1)
    const isSubmitted = context.team.round1.submitted
    const [noLinks, setNoLinks] = useState((isSubmitted && context.team.round1.projectLinks) || [""])
    const [technologies, setTechnologies] = useState((isSubmitted && context.team.round1.technologiesUsed) || [])
    const [start, setStart] = useState(isSubmitted)
    const [timer, setTimer] = useState()
    const [editable, setEditable] = useState(false)
    const [formError, setFormError] = useState({})

    const projectTitleRef = useRef()
    const projectDescriptionRef = useRef()
    const contributionRef = useRef()

    useEffect(() => {
        var deadline = new Date("Nov 29, 2021 19:15:00 GMT+0530").getTime();
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
            contribution : contributionRef.current.value, 
            technologiesUsed : technologies
        }

        var errors = formError
        for (const property in round1data) {
            if(round1data[property].length === 0){
                errors[property] = true
                setFormError(errors)
            }else{
                errors[property] = false
                setFormError(errors)
            }         
        }
        console.log('1')
        for(var error in errors){
            console.log(errors)
            if(errors[error] === true){
                return false
            }
        }
        if(noLinks.length === 0){
            context.showAlert("error", "Enter the link(s) before making submission.")
            return false
        }
        for (var link = 0; link < noLinks.length; link++){
            if(noLinks[link].length === 0){
                context.showAlert("error", "Enter the link(s) before making submission.")
                return false
            }
        }
        console.log("Making submission")
        await context.Round1Submission({...round1data, projectLinks : noLinks})
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
        <>
        {start ? 
        <>
        <Grid container sx={{display: "flex", justifyContent: 'space-evenly', bgcolor : "#0a1929"}} >
            <Grid item xs={11} mt={2} mb={1}>
                <Typography variant="h3" textAlign="center" fontSize={{xs: 25, sm:30, md: 35}}>Round - 1 Submission</Typography>
            </Grid>
            <Grid item md={5} sm={8} xs={11} mt={1} mb={1} sx={{p:3, borderRadius: 5, bgcolor : "#162534"}}>
                <Stack spacing={2}>
                    <FormLabel component="legend">Basic Details</FormLabel>
                    <TextField 
                        inputRef={projectTitleRef}
                        error = {formError.projectTitle}
                        label="Project Title"
                        placeholder = "What are you calling it?"
                        disabled={!(!timer.expired && editable)}
                        defaultValue = {isSubmitted ? context.team.round1.projectTitle : ""}
                    >
                    </TextField>
                    <TextField 
                        inputRef={projectDescriptionRef} 
                        label= "Project Description" 
                        error = {formError.projectDescription}
                        multiline 
                        placeholder = "Write a short, sharp and on point description of your project."
                        minRows={4} 
                        maxRows={6}
                        disabled={!(!timer.expired && editable)}
                        defaultValue = {isSubmitted ? context.team.round1.projectDescription : ""}
                    >
                    </TextField>
                    <FormLabel component="legend">Project Details</FormLabel>
                    <TextField 
                        inputRef={contributionRef} 
                        label= "Contribution to the society"
                        placeholder = "How it will help the society?" 
                        error = {formError.contribution}
                        multiline 
                        minRows={3} 
                        maxRows={4}
                        disabled={!(!timer.expired && editable)}
                        defaultValue = {isSubmitted ? context.team.round1.projectDescription : ""}
                    ></TextField>
                </Stack>
            </Grid>
            <Grid item md={3} sm={8} xs={11} my={2} sx={{p:3, borderRadius: 5, bgcolor : "#162534"}}>
                <Stack spacing={2}>
                    <FormLabel component="legend">Additional Details</FormLabel>
                    <FormControl >
                        <InputLabel id="demo-multiple-chip-label" sx={{bgcolor:"#162534", pr:0.7}}>Technologies Used</InputLabel>
                        <Select
                            multiple
                            error = {formError.technologiesUsed}
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
                    
                    <FormLabel component="legend">Project Links</FormLabel>
                    <TransitionGroup>
                    {noLinks.map((item, index) => 
                        <Collapse in={true}>
                        <TextField
                            key =  {index}
                            margin = "dense"
                            label={`Link #${index + 1}`} 
                            defaultValue={isSubmitted ? item : ""}
                            disabled={!(!timer.expired && editable)}
                            placeholder = "Paste or type a link"
                            fullWidth
                            onChange= {(event) => updateLinksArray(index, event.target.value)}
                            InputProps={{
                                endAdornment: <InputAdornment position="end"><IconButton  disabled={!(!timer.expired && editable)} onClick={() => deleteLink(index)}><DeleteIcon /></IconButton></InputAdornment>,
                            }}
                        ></TextField>
                        </Collapse>
                    )}
                    </TransitionGroup>
                    <Button disabled={!(!timer.expired && editable)} onClick={() => addLink()} startIcon={<AddIcon />}>Add link</Button>
                </Stack>
            </Grid>
            <Grid item xs={12} sx={{textAlign : 'center', mt:1, mb: 8}}>
                <DynamicButton timer={timer} editable={editable} MakeSubmission={MakeSubmission} />
            </Grid>
        </Grid>
        </>
        :
        <>
            {!isSubmitted && timer &&
                <Box sx={{textAlign: "center", minHeight: "80vh", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Stack spacing={1} >
                        <Typography sx={{fontSize: {xs:22, sm: 30}}}>Time left for Round - 1 Submission</Typography>
                        <Temp time={timer}/>
                            <Box>  
                        <Button variant="outlined" disabled={timer.expired} sx={{minWidth: 200}} onClick={() => {setStart(true)}}>{timer.expired ?  "Submission Deadline is over" : "Start"}</Button> </Box>
                    </Stack>
                </Box> } 
        </>
        }
    </>   
    )
}

export default Round1