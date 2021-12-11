import { Box, Grid, Typography, Button, Chip, CircularProgress, Stepper, StepLabel, Step} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./Contexts/AuthContext";
import NavBar from "./Navbar";
import Countdown from "./Countdown"
import Timer from "./Timer";

export default function Dashboard(){
    const context = useContext(AuthContext)
    const [timer, setTimer] = useState()
    const [activeStep, setActiveStep] = useState()

    useEffect(() => {
        var presentationRound = new Date("Dec 30, 2021 23:59:59 GMT+0530").getTime()
        var evaluation = new Date("Dec 25, 2021 23:59:59 GMT+0530").getTime()
        var deadline = new Date("Dec 20, 2021 23:59:59 GMT+0530").getTime()
        var current = new Date().getTime()

        if(presentationRound <= current && context.userData.connectedWithTeam && context.team.submission.submitted){
            setActiveStep(5)
        }else if(presentationRound >= deadline && context.userData.connectedWithTeam && context.team.submission.submitted){
            setActiveStep(4)
        }else if(evaluation >= deadline && context.userData.connectedWithTeam && context.team.submission.submitted){
            setActiveStep(3)
        }else if(deadline >= current && context.userData.connectedWithTeam){
            setActiveStep(2)
        }else if(!context.userData.connectedWithTeam){
            setActiveStep(1)
        }
        
        const interval = setInterval(function(){
            current = current + 1000
            setTimer(Timer(deadline, current))
        }, 1000);
        return () => {
            clearInterval(interval)
        }
    }, [context.userData.connectedWithTeam, context.team.submission.submitted])

    return (
        <>
            <NavBar />
            <Grid container sx={{ mt : 10, bgcolor : "#0a1929"}}> 
                <Grid item md={8} sm={8} xs={11} sx={{ borderRadius: 5, margin:"auto", py: 1}}>
                    <Typography sx={{fontSize: {xs: 30, md: 45}}}>Hey {context.userData.firstName.charAt(0).toUpperCase() + context.userData.firstName.slice(1)}!</Typography>
                </Grid>

                <Grid item md={8} sm={8} xs={11} sx={{px: 3, display: {xs: "none", sm: "block"}, borderRadius: 5, bgcolor: "#162534", margin:"auto", py: {xs: 5, md: 6}, my:3}}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        <Step>
                            <StepLabel>Sign up</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Create or join a team</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Project Submission</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Project Evaluation</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Presentation Round (Selected Teams)</StepLabel>
                        </Step>
                    </Stepper>
                </Grid>

                <Grid item md={8} sm={8} xs={11} sx={{px: 3, display: {xs: "block", sm: "none"}, borderRadius: 5, bgcolor: "#162534", margin:"auto", py: {xs: 5, md: 6}, my:3}}>
                    <Stepper activeStep={0} orientation="vertical">
                        <Step>
                            <StepLabel>Sign up</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Create or join a team</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Project Submission</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Project Evaluation</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Presentation Round (Selected Teams)</StepLabel>
                        </Step>
                    </Stepper>
                </Grid>

                {!context.userData.connectedWithTeam && <Grid item md={8} sm={8} xs={11} sx={{ p:3, borderRadius: 5, bgcolor: "#162534", margin:"auto", py: {xs: 5, md: 6}, my:3, textAlign: "center"}}>
                    <Typography sx={{fontSize: 20}}>You are not connected to any team yet! </Typography>
                    <Button sx={{mt: 1}} onClick={() => context.navigate("/team")} variant="outlined">Create or join a team</Button>
                </Grid>}

                <Grid item md={8} sm={8} xs={11} sx={{ borderRadius: 5, bgcolor: "#162534", margin:"auto", py: 3, my:3}}>
                    <Box sx={{textAlign: "center", display: 'grid', placeContent : "center"}}>
                        {timer ? 
                        <Box sx={{ borderRadius: 3, mx:{xs: 2, sm: 0}}}> 
                            <Typography sx={{fontSize : {xs: 25, md: 30}}}>Hack4Good Submission</Typography>
                            <Box sx={{display: "block", my:2}}>
                                <Chip sx={{px:2}} label="Deadline: December 20, 2021" />
                            </Box>
                            <Typography>Time left for Submission deadline</Typography>
                            <Countdown time={timer}/>
                            <Button variant="outlined" disabled={timer.expired} sx={{minWidth: 200}} onClick={() => {context.navigate("/submission")}}>{timer.expired ?  "Submission deadline is over" : "Submit Now"}</Button> 
                        </Box> : 
                        <CircularProgress />}
                    </Box>
                </Grid>
                
            </Grid>
        </>
    )
}