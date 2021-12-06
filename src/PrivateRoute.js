import { useContext } from "react"
import { Navigate } from "react-router"
import { AuthContext } from "./Contexts/AuthContext"

function PrivateRoute({children}){
    const context = useContext(AuthContext)
    if(!context.team){
        context.showAlert("info", "You should create or join a team first in order to make submissions!")
    }
    return context.team ? children : <Navigate to="/team" />
}

export default PrivateRoute