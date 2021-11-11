import { Button } from "@mui/material";
import { useContext, useEffect } from "react";
import { AuthContext } from "./Contexts/AuthContext";

function Login(){
    const context = useContext(AuthContext)

    useEffect(() => {
        if (context.currentUser){
            context.navigate("/Submissions")
        }
    }, [context])

    return (
        <>
            <Button onClick={() => context.login("Google")}>Login with Google </Button>
        </>
    )
}

export default Login