import { Button } from "@mui/material"

function DynamicButton({timer, editable, MakeSubmission}){
    if(timer.expired){
        return (
            <Button variant="contained" disabled>Submission deadline is over</Button>
        )}else if(editable){
            return (    
            <Button variant="contained" onClick={MakeSubmission}>Update Submission</Button>
        )}else if(!editable){
            return (
                <Button variant="contained" onClick={MakeSubmission}>Edit Submission</Button> 
        )}
}


export default DynamicButton