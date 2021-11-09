import Alert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';

function ShowAlert(props){
    console.log(props)
    return (
        <Snackbar open={props.props.show} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} autoHideDuration={6000} onClose={props.hide}>
            <Alert onClose={props.hide} variant="filled" severity="success" sx={{ width: '100%' }}>
                {props.props.message}
            </Alert>
        </Snackbar>  
    )
}

export default ShowAlert