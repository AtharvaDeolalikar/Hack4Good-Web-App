import { Button } from "@mui/material"

function DynamicButton({timer, editable, MakeSubmission, submitted}){
    if(timer.expired){
        return (
            <Button variant="contained" disabled>Submission deadline is over</Button>
    )}else if(!submitted){
        return(
            <Button variant="contained" onClick={MakeSubmission}>Make Submission</Button>
    )}else{
        return (
            <Button variant="contained" onClick={MakeSubmission}>{editable ? "Update" : "Edit"} Submission</Button>
    )}
}


export default DynamicButton