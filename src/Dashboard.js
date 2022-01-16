import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Stepper,
  StepLabel,
  Step,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./Contexts/AuthContext";
import NavBar from "./Navbar";
import Countdown from "./Countdown";
import Timer from "./Timer";

export default function Dashboard() {
  const context = useContext(AuthContext);
  const [countdown, setCountdown] = useState({ show: false });
  const [activeStep, setActiveStep] = useState();

  useEffect(() => {
    var presentationRound = context.publicSettings.presentationRound
      .toDate()
      .getTime();
    var evaluation = context.publicSettings.evaluationRound.toDate().getTime();
    var registrationDeadline = context.publicSettings.registrationDeadline
      .toDate()
      .getTime();
    var submissionDeadline = context.publicSettings.submissionDeadline
      .toDate()
      .getTime();
    var current = new Date().getTime({});

    if (!context.userData.connectedWithTeam) {
      setActiveStep(1);
    } else if (
      submissionDeadline >= current &&
      context.userData.connectedWithTeam
    ) {
      setActiveStep(2);
    } else if (
      evaluation >= submissionDeadline &&
      context.userData.connectedWithTeam &&
      context.team.submission.submitted
    ) {
      setActiveStep(3);
    } else if (
      presentationRound >= submissionDeadline &&
      context.userData.connectedWithTeam &&
      context.team.submission.submitted
    ) {
      setActiveStep(4);
    } else {
      setActiveStep(5);
    }

    const interval = setInterval(function () {
      current = current + 1000;
      if (registrationDeadline >= current) {
        setCountdown({
          title: "Registration ends in",
          show: true,
          buttonShow: false,
          chip: `Deadline: ${context.publicSettings.registrationDeadline
            .toDate()
            .toLocaleString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}`,
          timer: Timer(registrationDeadline, current),
        });
      } else if (submissionDeadline > current) {
        setCountdown({
          title: "Hackathon Submission",
          message: "Submission deadline is over",
          chip: `Deadline: ${context.publicSettings.submissionDeadline
            .toDate()
            .toLocaleString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}`,
          show: true,
          buttonShow: true,
          timer: Timer(submissionDeadline, current),
        });
      } else if (current >= submissionDeadline) {
        console.log("B");
        setCountdown({
          message: "Submission deadline is over",
          show: true,
          buttonShow: true,
        });
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <NavBar />
      <Grid container sx={{ mt: 10, bgcolor: "#0a1929" }}>
        <Grid
          item
          md={8}
          sm={8}
          xs={11}
          sx={{ borderRadius: 5, margin: "auto", py: 1 }}
        >
          <Typography sx={{ fontSize: { xs: 30, md: 45 } }}>
            {"Hey " +
              context.userData.firstName.charAt(0).toUpperCase() +
              context.userData.firstName.slice(1) +
              "!"}
          </Typography>
        </Grid>

        <Grid
          item
          md={8}
          sm={8}
          xs={11}
          sx={{
            px: 3,
            display: { xs: "none", sm: "block" },
            borderRadius: 5,
            bgcolor: "#162534",
            margin: "auto",
            py: { xs: 5, md: 6 },
            my: 3,
          }}
        >
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

        <Grid
          item
          md={8}
          sm={8}
          xs={11}
          sx={{
            px: 3,
            display: { xs: "block", sm: "none" },
            borderRadius: 5,
            bgcolor: "#162534",
            margin: "auto",
            py: { xs: 5, md: 6 },
            my: 3,
          }}
        >
          <Stepper activeStep={activeStep} orientation="vertical">
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

        {!context.userData.connectedWithTeam && (
          <Grid
            item
            md={8}
            sm={8}
            xs={11}
            sx={{
              p: 3,
              borderRadius: 5,
              bgcolor: "#162534",
              margin: "auto",
              py: { xs: 5, md: 6 },
              my: 3,
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontSize: 20 }}>
              You are not connected to any team yet!{" "}
            </Typography>
            <Button
              sx={{ mt: 1 }}
              onClick={() => context.navigate("/team")}
              variant="outlined"
            >
              Create or join a team
            </Button>
          </Grid>
        )}

        <Grid
          item
          md={8}
          sm={8}
          xs={11}
          sx={{
            borderRadius: 5,
            bgcolor: "#162534",
            margin: "auto",
            py: 3,
            my: 3,
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              display: "grid",
              placeContent: "center",
            }}
          >
            {countdown.show ? (
              <Box sx={{ borderRadius: 3, mx: { xs: 2, sm: 0 } }}>
                <Typography sx={{ fontSize: { xs: 25, md: 30 } }}>
                  {countdown.title}
                </Typography>

                <Typography>{countdown.subtitle}</Typography>
                <Countdown time={countdown.timer} />
                <Box sx={{ display: "block", my: 2 }}>
                  <Chip sx={{ px: 2 }} label={countdown.chip} />
                </Box>
                {countdown.buttonShow && (
                  <Button
                    variant="outlined"
                    disabled={countdown.timer.expired}
                    sx={{ minWidth: 200 }}
                    onClick={() => {
                      context.navigate("/submission");
                    }}
                  >
                    {countdown.timer.expired
                      ? "Submission deadline is over"
                      : "Submit Now"}
                  </Button>
                )}
              </Box>
            ) : (
              <CircularProgress />
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
