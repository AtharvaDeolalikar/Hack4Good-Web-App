import {Box, TextField, Typography, Stack, Button, FormLabel, Grid, InputAdornment, IconButton, Select, Chip, InputLabel, FormControl, CircularProgress, Divider} from "@mui/material"
import { useContext, useEffect, useRef, useState } from "react"
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import { AuthContext } from "./Contexts/AuthContext";
import DeleteIcon from '@mui/icons-material/Delete';
import OutlinedInput from '@mui/material/OutlinedInput';
import Timer from "./Timer";
import Countdown from "./Countdown";
import DynamicButton from "./DynamicButton";
import { TransitionGroup } from 'react-transition-group';
import Collapse from '@mui/material/Collapse'
import NavBar from "./Navbar";
import Footer from "./Footer";

function Submission(){
    const context = useContext(AuthContext) 
    const isSubmitted = context.team.submission.submitted
    const [noLinks, setNoLinks] = useState((isSubmitted && context.team.submission.projectLinks) || [""])
    const [technologies, setTechnologies] = useState((isSubmitted && context.team.submission.technologiesUsed) || [])
    const [start, setStart] = useState(isSubmitted)
    const [timer, setTimer] = useState()
    const [editable, setEditable] = useState(false)
    const [formError, setFormError] = useState({})
    const [loadButton, setLoadButton] = useState(false)

    const projectTitleRef = useRef()
    const projectDescriptionRef = useRef()
    const contributionRef = useRef()

    

    useEffect(() => {
        if(!context.team){
            context.showAlert("info", "You should create or join a team first in order to make submissions!")
            context.navigate("/team")
        }

        var deadline = new Date("Dec 7, 2021 19:15:00 GMT+0530").getTime();
        var current = new Date().getTime();
        const interval = setInterval(function(){
            current = current + 1000
            setTimer(Timer(deadline, current))
        }, 1000);
        return () => {
            clearInterval(interval)
        }
    }, [])

    async function MakeSubmission(){
        if(timer.expired){
            return false
        }
        if(!editable){
            setEditable(true)
            return false
        }
        const submissiondata = {
            projectTitle: projectTitleRef.current.value,
            projectDescription : projectDescriptionRef.current.value,
            contribution : contributionRef.current.value, 
            technologiesUsed : technologies
        }

        var errors = formError
        for (const property in submissiondata) {
            if(submissiondata[property].length === 0){
                errors[property] = true
                setFormError(errors)
            }else{
                errors[property] = false
                setFormError(errors)
            }         
        }
        for(var error in errors){
            if(errors[error] === true){
                return false
            }
        }
        if(noLinks.length === 0){
            context.showAlert("error", "Enter the link(s) before making submission.")
            return false
        }
        for (var link = 0; link < noLinks.length; link++){
            if(!noLinks[link].startsWith("https://")){
                context.showAlert("error", "The link(s) must start with 'https://'")
                return false
            }
        }
        await context.makeSubmission({...submissiondata, projectLinks : noLinks})
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
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight : "100vh", width : "100%"}}>
                <CircularProgress />
            </Box>
        )
    }
    
    return (         
        <>
        <NavBar />
        {start ? 
        <>
        <Grid container sx={{display: "flex", justifyContent: 'space-evenly', bgcolor : "#0a1929", minHeight: "100vh"}} >
            <Grid item xs={11} mt={10} mb={1}>
                <Typography variant="h3" textAlign="center" fontSize={{xs: 25, sm:30, md: 35}}>Hack4Good Submission</Typography>
            </Grid>
            <Grid item md={5} sm={8} xs={11} mt={1} mb={1} sx={{p:4, borderRadius: 2, bgcolor : "#162534"}}>
                <Stack spacing={2}>
                    <FormLabel component="legend">Basic Details</FormLabel>
                    <TextField 
                        inputRef={projectTitleRef}
                        error = {formError.projectTitle}
                        label="Project Title"
                        placeholder = "What are you calling it?"
                        disabled={!(!timer.expired && editable)}
                        defaultValue = {isSubmitted ? context.team.submission.projectTitle : ""}
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
                        defaultValue = {isSubmitted ? context.team.submission.projectDescription : ""}
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
                        defaultValue = {isSubmitted ? context.team.submission.projectDescription : ""}
                    ></TextField>
                </Stack>
            </Grid>
            <Grid item md={3} sm={8} xs={11} my={2} sx={{p:4, borderRadius: 2, bgcolor : "#162534"}}>
                <Stack spacing={2}>
                    <FormLabel component="legend">Additional Details</FormLabel>
                    <FormControl>
                        <InputLabel>Technologies Used</InputLabel>
                        <Select
                            multiple
                            error = {formError.technologiesUsed}
                            disabled={!(!timer.expired && editable)}
                            value={technologies}
                            onChange={handleTechChange}
                            input={<OutlinedInput label="Technologies Used" />}
                            renderValue={(selected) => (
                                <Stack direction="row" sx={{flexWrap : "wrap" , gap: 1}}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                                </Stack>
                            )}
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
            <Grid item xs={12} sx={{textAlign : 'center', mt:1, mb: 10}}>
                <DynamicButton timer={timer} editable={editable} MakeSubmission={MakeSubmission} submitted={isSubmitted}/>
            </Grid>
        </Grid>
        </>
        :
        <>
            {!isSubmitted && timer &&
                <Box sx={{textAlign: "center", minHeight: "100vh", display: 'flex'}}>
                    <Box sx={{padding:4, m:3, justifyContent: "center", borderRadius: 3, margin: "auto", border: (theme) => `1px solid ${theme.palette.divider}`}}> 
                        <Typography variant="h4">Hack4Good Submission</Typography>
                        <Box sx={{display: "block", my:2}}>
                                <Chip sx={{px:2}} label="Deadline: November 15, 2021" />
                        </Box>
                        <Typography>Time left for Submission deadline</Typography>
                        <Countdown time={timer}/>
                        <Box>  
                            <Button variant="outlined" disabled={timer.expired} sx={{minWidth: 200}} onClick={() => {setStart(true)}}>{timer.expired ?  "Submission Deadline is over" : "Start"}</Button> 
                        </Box>
                    </Box>
                </Box>} 
        </>
        }
        <Footer />
    </>   
    )
}

export default Submission