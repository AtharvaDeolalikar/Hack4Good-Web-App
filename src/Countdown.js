import { Box, Stack, Typography } from "@mui/material"

function Countdown({time}){
    const timerStyles = {
        borderRadius: 4,
        p:3, 
        minWidth: 130,
        m: 2,
        bgcolor: "#101c2c"
    }
    return(
        <>  
            <Stack sx={{display: "flex", flexWrap : "wrap", justifyContent: "center", flexDirection : "row"}}>
                <Box sx={timerStyles} fontSize={40}>{time.days} <Typography >Day{time.days > 1 && "s"}</Typography></Box>
                <Box sx={timerStyles} fontSize={40}>{time.hours} <Typography >Hour{time.hours > 1 && "s" }</Typography></Box>
                <Box sx={timerStyles} fontSize={40}>{time.minutes} <Typography >Minute{time.minutes > 1 && "s"}</Typography></Box>
                <Box sx={timerStyles} fontSize={40}>{time.seconds} <Typography >Second{time.seconds > 1 && "s"}</Typography></Box>
            </Stack>
        </>
    )
}

export default Countdown