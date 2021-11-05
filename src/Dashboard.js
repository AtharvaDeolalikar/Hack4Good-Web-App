function Dashboard(props){
    const currentUser = props.authFunctions.currentUser
    return (
        <>
            <h1>Hey {currentUser.displayName} </h1>
            <button onClick={props.authFunctions.logOut}>Logout</button>
        </>
    )
}

export default Dashboard