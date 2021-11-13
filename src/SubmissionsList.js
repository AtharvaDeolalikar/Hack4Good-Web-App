import { Box, Typography, Stack, Chip, Button} from "@mui/material";
import { Link } from "react-router-dom";

function SubmissionsList(){
    return (
        <Box sx={{display: "flex", justifyContent: "space-evenly", flexWrap: "wrap", alignItems: "center", minHeight : "75vh", width : "100%", textAlign: "center" , mb:7}}>
            <Box sx={{padding:4, m:3, borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}`, maxWidth: 450}}>
                <Stack spacing={2}>
                    <Typography variant="h4">Round - 1</Typography>
                    <Box sx={{display: "block"}}>
                        <Chip sx={{px:2}} label="Deadline: November 15, 2021"></Chip>
                    </Box>
                    <Typography color="grey">In Round - 1, your team is required to submit a slide deck on your project topic.</Typography>
                    <Button component={Link} to="Round-1" variant="outlined">Submit Now</Button> 
                </Stack>
            </Box>

            <Box sx={{padding:4, m:3, borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}` ,  maxWidth: 450}}>
                <Stack spacing={2}>
                    <Typography variant="h4">Round - 2</Typography>
                    <Box sx={{display: "block"}}>
                        <Chip sx={{px:2}} label="Deadline: November 20, 2021"></Chip>
                    </Box>
                    <Typography color="grey">In Round - 2, your team is required to submit the prototype of your project.</Typography>
                    <Button component={Link} to="Round-2" disabled variant="outlined">Submissions starts on November 17, 21</Button> 
                </Stack>
            </Box>
        </Box>

    )
}

export default SubmissionsList