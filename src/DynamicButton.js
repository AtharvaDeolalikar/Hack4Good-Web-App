import { LoadingButton } from "@mui/lab"
import { Button } from "@mui/material"

function DynamicButton({timer, editable, MakeSubmission, submitted, load}){
    if(timer.expired){
        return (
            <Button variant="contained" disabled>Submission deadline is over</Button>
    )}else if(!submitted){
        return(
            <Button variant="contained" type="submit">Make Submission</Button>
    )}else{
        return (
            <LoadingButton variant="contained" loading={load} type="submit">{editable ? "Update" : "Edit"} Submission</LoadingButton>
    )}
}


export default DynamicButton