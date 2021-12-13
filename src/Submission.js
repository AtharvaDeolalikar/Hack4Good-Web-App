import {Box, TextField, Typography, Stack, FormLabel, Grid, Chip, CircularProgress} from "@mui/material"
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "./Contexts/AuthContext";
import Timer from "./Timer";
import DynamicButton from "./DynamicButton";
import NavBar from "./Navbar";
import Footer from "./Footer";
import SubmissionInstructions from "./SubmissionInstructions";
import options from "./options.json"

function Submission(){
    const context = useContext(AuthContext)
    const submission = context.team.submission
    const [isSubmitted] = useState(submission.submitted)
    const [technologies, setTechnologies] = useState((isSubmitted && submission.technologiesUsed) || [])
    const [timer, setTimer] = useState()
    const [editable, setEditable] = useState(false)
    const [loadButton, setLoadButton] = useState(false)
    const [instructions, setInstructions] = useState(!isSubmitted)
    
    const filter = createFilterOptions();

    useEffect(() => {
        var deadline = new Date("Dec 20, 2021 23:59:59 GMT+0530").getTime()
        var current = new Date().getTime()
        const interval = setInterval(function(){
            current = current + 1000
            setTimer(Timer(deadline, current))
        }, 1000);
        return () => {
            clearInterval(interval)
        }
    }, [])

    async function MakeSubmission(e){
        e.preventDefault()

        if(timer.expired){
            return false
        }
        if(!editable){
            setEditable(true)
            return false
        }
        setLoadButton(true)

        const submissionData = {
            problemStatementID : e.target.problemStatementID.value,
            projectTitle: e.target.projectTitle.value,
            projectDescription : e.target.projectDescription.value,
            contribution : e.target.contribution.value, 
            projectLinks : {
                githubRepo : e.target.githubRepo.value, 
                videoDemo: e.target.videoDemo.value, 
                deployed: e.target.deployed.value,
                dataset: e.target.dataset.value
            },
            technologiesUsed : technologies
        }
        
        if((!e.target.problemStatementID.value.startsWith("P")) && (!e.target.problemStatementID.value.startsWith("OB"))){
            context.showAlert("warning", `Kindly enter a valid problem statement ID`)
            setLoadButton(false)
            return false   
        }

        for (const item in submissionData){
            if(typeof submissionData[item] == "string" && submissionData[item].length === 0){
                context.showAlert("warning", `Kindly enter ${e.target[item].id}`)
                setLoadButton(false)
                return false
            }
        }

        if(submissionData.projectLinks.githubRepo.length === 0 || submissionData.projectLinks.videoDemo.length === 0 || submissionData.projectLinks.dataset.length === 0){
            context.showAlert("warning", `You must provide the required project link(s)`)
            setLoadButton(false)
            return false       
        }
        
        for (const link in submissionData.projectLinks){
            if(submissionData.projectLinks[link] !== "" && !submissionData.projectLinks[link].startsWith('https')){
                context.showAlert("warning", "The link(s) must start with https://")
                setLoadButton(false)
                return false
            }
        }
        
        await context.makeSubmission({...submissionData})
        setEditable(false)
        setLoadButton(false)
    }


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
        {!isSubmitted && <SubmissionInstructions open={instructions} close={() => setInstructions(false)}/>}

        <Grid container sx={{display: "flex", justifyContent: 'space-evenly', bgcolor : "#0a1929", minHeight: "100vh"}} component="form" onSubmit={MakeSubmission}>
            <Grid item xs={11} mt={10} mb={1}>
                <Typography variant="h3" textAlign="center" fontSize={{xs: 25, sm:30, md: 35}}>Hack4Good Submission</Typography>
            </Grid>
            <Grid item md={5} sm={8} xs={11} mt={1} mb={1} sx={{p:4, borderRadius: 2, bgcolor : "#162534"}}>
                <Stack spacing={2}>
                    <FormLabel component="legend">Basic Details</FormLabel>
                    <TextField 
                        label="Problem Statement ID"
                        placeholder = "Eg. P01"
                        name="problemStatementID"
                        id = "the problem statement ID"
                        disabled={!(!timer.expired && editable)}
                        defaultValue = {isSubmitted ? submission.problemStatementID : ""}
                    />
                    <TextField 
                        label="Project Title"
                        name = "projectTitle"
                        id = "the project title"
                        placeholder = "What are you calling it?"
                        disabled={!(!timer.expired && editable)}
                        defaultValue = {isSubmitted ? submission.projectTitle : ""}
                    />
                    <TextField 
                        name = "projectDescription"
                        label= "Project Description" 
                        id = 'the project description'
                        multiline 
                        placeholder = "Write a short, sharp and on point description of your project."
                        minRows={4} 
                        maxRows={6}
                        disabled={!(!timer.expired && editable)}
                        defaultValue = {isSubmitted ? submission.projectDescription : ""}
                    />
                    <FormLabel component="legend">Project Details</FormLabel>
                    <TextField 
                        name = "contribution"
                        label= "Contribution to the society"
                        placeholder = "How it will help the society?" 
                        id = 'how it will contribute to the society'
                        multiline 
                        minRows={3} 
                        maxRows={4}
                        disabled={!(!timer.expired && editable)}
                        defaultValue = {isSubmitted ? submission.projectDescription : ""}
                    />
                </Stack>
            </Grid>
            <Grid item md={3} sm={8} xs={11} my={2} sx={{p:4, borderRadius: 2, bgcolor : "#162534"}}>
                <Stack spacing={2}>
                    <FormLabel component="legend">Additional Details</FormLabel>
                    <Autocomplete
                        multiple
                        options={options.options}
                        freeSolo
                        disabled={!(!timer.expired && editable)}
                        value = {technologies}
                        onChange = {(event, newValue) => {
                            if (typeof newValue === 'string') {
                              setTechnologies(newValue);
                            } else if (newValue && newValue.inputValue) {
                              // Create a new value from the user input
                              setTechnologies(newValue.inputValue);
                            } else {
                              setTechnologies(newValue);
                            }
                        }}
                        disableCloseOnSelect
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip variant="filled" label={option} {...getTagProps({ index })} />
                            ))
                        }
                        filterOptions={(options, params) => {
                            const filtered = filter(options, params)
                            const { inputValue } = params;
                            // Suggest the creation of a new value
                            const isExisting = options.some((option) => inputValue === option);
                            if (inputValue !== '' && !isExisting) {
                              filtered.push(
                                inputValue
                              );
                            }
                    
                            return filtered;
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Technologies Used"
                            />
                        )}
                    />

                    <FormLabel component="legend">Project Links</FormLabel>
                    <TextField
                        name = "githubRepo"
                        label = "GitHub Repository"
                        disabled={!(!timer.expired && editable)}
                        fullWidth
                        defaultValue = {isSubmitted ? submission.projectLinks.githubRepo : ""}
                    ></TextField>
                     <TextField
                        name = "videoDemo"
                        label = "Video Demonstration"
                        disabled={!(!timer.expired && editable)}
                        defaultValue = {isSubmitted ? submission.projectLinks.videoDemo : ""}
                        fullWidth                        
                    ></TextField>
                     <TextField
                        name = "dataset"
                        label = "Used Dataset Link"
                        disabled={!(!timer.expired && editable)}
                        defaultValue = {isSubmitted ? submission.projectLinks.dataset : ""}
                        fullWidth
                    ></TextField>
                    <TextField
                        name = "deployed"
                        label = "Deployed Link (Optional)"
                        disabled={!(!timer.expired && editable)}
                        defaultValue = {isSubmitted ? submission.projectLinks.deployed : ""}
                        fullWidth
                    ></TextField>
                </Stack>
            </Grid>
            <Grid item xs={12} sx={{textAlign : 'center', mt:1, mb: 10}}>
                <DynamicButton timer={timer} editable={editable} submitted={isSubmitted} load={loadButton}/>
            </Grid>
        </Grid>
        <Footer />
    </>
    )
}

export default Submission