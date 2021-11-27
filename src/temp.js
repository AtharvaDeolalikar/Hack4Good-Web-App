import { Box, Stack, Typography } from "@mui/material"

function Temp({time}){
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
                <Box sx={timerStyles} fontSize={40}>{time.days} <Typography >{time.days === 1 ? "Day" : "Days"}</Typography></Box>
                <Box sx={timerStyles} fontSize={40}>{time.hours} <Typography >{time.hours === 1 ? "Hour" : "Hours"}</Typography></Box>
                <Box sx={timerStyles} fontSize={40}>{time.minutes} <Typography >{time.minutes === 1 ? "Minute" : "Minutes"}</Typography></Box>
                <Box sx={timerStyles} fontSize={40}>{time.seconds} <Typography >{time.seconds === 1 ? "Second" : "Seconds"}</Typography></Box>
            </Stack>
        </>
    )
}

export default Temp