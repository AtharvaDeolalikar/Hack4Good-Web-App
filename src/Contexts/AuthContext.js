import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../config";
import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, onAuthStateChanged} from "firebase/auth";
import { getFirestore , collection, addDoc, updateDoc, arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import ShowAlert from "../ShowAlert";
import Loading from "../Loading";
import { ThemeProvider } from '@mui/material/styles'
import Theme from "./Theme";
import moment from "moment";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext)
}

function AuthContextProvider({children}){
    const [currentUser, setCurrentUser] = useState()
    const [userData, setUserData] = useState()
    const [team, setTeam] = useState()
    const [alert, setAlert] = useState(false)
    const [loading, setLoading] = useState(true)
    const [redirect, setRedirect] = useState({navigate : null})

    initializeApp(firebaseConfig);
    const auth = getAuth();
    const db = getFirestore();
    const provider =  new GoogleAuthProvider()
    
    let navigate = useNavigate()
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user)
                getUserData(user)
            } else {
                console.log("No user exist")
                login()
                //setLoading(false)
                //navigate("/login")
            }
        })
        
        const getUserTeam = async (teamID) => {
          try {
            const teamData = await getDoc(doc(db, "teams", teamID));
            const temp = teamData.data()
            setTeam(temp)
            //setLoading(false)
        }
          catch(e){
            console.log(e)
            //setLoading(false)
          }
        };

        const getUserData = async (user) => {
          try {
            const userData = await getDoc(doc(db, "users", user.uid));
            const temp = userData.data()
            setUserData(temp)
            if(!temp){
              if(window.location.pathname == "/team/join"){
                setRedirect({navigate: window.location.pathname + window.location.search})
                showAlert("info", "You'll require to sign up first!")
                //console.log(window.location.pathname + window.location.search)
              }
              navigate("/signup", { replace: true })
              setLoading(false)
            }else if(temp.teamID){
              await getUserTeam(temp.teamID)
              if(window.location.pathname === "/"){
                navigate("/Submissions")
              }
            }else if(window.location.pathname === "/"){
              navigate("/team")
            }
            setLoading(false)
          }
          catch(e){
            console.log(e)
          }
        };
        
    }, [auth, db, navigate]);

    //console.log(getAuth().currentUser)

    function login(){
      signInWithRedirect(auth, provider)
      getRedirectResult(auth)
      .then((result) => {
      setCurrentUser(result.user)
      }).catch((error) => {
      console.log(error)
      })
    }

    function logOut(){
      signOut(auth).then(() => {
      console.log("Sign-out successful")
      //navigate("login")
      }).catch((error) => {
      console.log(error)
      })
    }
 
    async function createTeam(name){
        if(name.length === 0){
          showAlert("error", "Enter the team name first!")
          return false
        }
        try {
            const docRef = await addDoc(collection(db, "teams"), {
              teamName: name,
              createdAt: moment().format('ddd, MMM DD YYYY, h:mm:ss a'),
              round1: {submitted: false},
              round2: {submitted: false},
              leader: {name: currentUser.displayName, email: currentUser.email, uid: currentUser.uid},
              members: [{name: currentUser.displayName, emailID: currentUser.email, uid: currentUser.uid}]
            });
            console.log("Team created with ID: ", docRef.id);
            setAlert({severity: "success", message: "New team has been successfully created!", show: true})
            connectTeam(docRef.id, true)
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }

    async function Round1Submission(data){
      try {
          await updateDoc(doc(db, "teams", userData.teamID), {round1 : {submitted: true, lastUpdatedAt: moment().format('ddd, MMM DD YYYY, h:mm:ss a'), ...data}});
          showAlert("success", "Your submission has been saved successfully. However you can make the changes before the deadline.")
        } catch (e) {
          console.error("Error adding user: ", e);
        }
    }

    async function addUser(data){
      try {
          await setDoc(doc(db, "users", currentUser.uid), {uid: currentUser.uid, registeredAt: moment().format('ddd, MMM DD YYYY, h:mm:ss a'), ...data});
          showAlert("success", "Data has been uploaded successfully!")
          if(redirect.navigate){
            navigate(redirect.navigate)
          }else{
          navigate("/team", {replace: true})
          }
        } catch (e) {
          console.error("Error adding user: ", e);
        }
    }

    async function connectTeam(teamID, isLeader){
      console.log(teamID)
      try {
          await updateDoc(doc(db, "users", currentUser.uid), {connectedWithTeamAt: moment().format('ddd, MMM DD YYYY, h:mm:ss a'), TeamLeader: isLeader, teamID : teamID});
          if(window.location.pathname == "/team"){
            window.location.reload()
          }else{
            console.log("A")
            navigate("/team")
          }
          
          //window.location.pathname = "/profile"
          //console.log("User added with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding user: ", e);
        }
    }

    async function updateUser(data){
      console.log(data)
      try {
          setUserData({uid: currentUser.uid, teamID: userData.teamID, ...data})
          //const tempUser = {name: userData.name, emailID: currentUser.email, uid: currentUser.uid}
          await updateDoc(doc(db, "users", currentUser.uid), {lastUpdatedAt: moment().format('ddd, MMM DD YYYY, h:mm:ss a'), ...data})
          //await updateDoc(doc(db, "teams", userData.teamID), {uid: currentUser.uid, ...data});
          const tempRef = await getDoc(doc(db, "teams", userData.teamID))
          const temp = tempRef.data()
          const tempArray = temp.members
          console.log(tempArray)
          for (var member = 0; member < temp.members.length ; member++){
            //console.log("temp.members[member].uid", temp.members[member].uid, "UserData.uid",  userData.uid)
            if(temp.members[member].uid === userData.uid){
              tempArray[member] = {name: data.name, emailID: currentUser.email, uid: currentUser.uid}
              console.log(tempArray)
              await updateDoc(doc(db, "teams", userData.teamID), {members: tempArray})
            }
          }
          /* await updateDoc(doc(db, "teams", userData.teamID), {
            members: arrayUnion({name: userData.name, emailID: currentUser.email, uid: currentUser.uid})
          }); */
          showAlert("success", "Profile has been updated successfully")
        } catch (e) {
          console.error("Error adding user: ", e);
        }
    }

    async function updateTeam(newName){
      if(team.teamName !== newName){
        try {
          await updateDoc(doc(db, "teams", userData.teamID), {lastUpdatedAt: moment().format('ddd, MMM DD YYYY, h:mm:ss a'), teamName: newName});
          //console.log("User added with ID: ", docRef.id);
          showAlert("success", "Team name has been updated successfully")
        } catch (e) {
          console.error("Error updating team name: ", e);
        }
      }else{
        showAlert("error","New team name cannot be same as current team name.")
      }
    }
    

    async function findTeam(teamID){
      if(teamID.length === 0){
        showAlert("error", "Enter the Team ID first!")
        return false
      }
        try {
            const teamRef = doc(db, "teams", teamID);
            const docSnap = await getDoc(teamRef)
            const teamData = docSnap.data()
            console.log(userData.teamID)
            if(userData.teamID){
              showAlert("error" , "You are already a member of a team!")
              return false
            }
            if (docSnap.exists()) {
              if (teamData.members.length === 4){
                showAlert("error", "A team can have a maximum of 4 members only!" )
                return false
              }
                return teamData.teamName
              /* for (var member = 0 ; member < teamData.members.length ; member++){
                if (teamData.members[member].uid === currentUser.uid) {
                  showAlert("error", `It seems that you are already a member of the team ${teamData.teamName}`)
                  return false
                }
              } */
            } else {
                showAlert("error", "Team ID does not exist!")
                return false
              }
            
            /* await updateDoc(doc(db, "teams", teamID), {
                members: arrayUnion({name: userData.name, emailID: currentUser.email, uid: currentUser.uid})
            });
            console.log("Added member with teamID: ", teamRef.id);
            showAlert("success", `You have been successfully connected to the team ${teamData.teamName}`)
            connectTeam(teamRef.id, false) */
          } catch (e) {
            //console.error("Error:", e);
          }

    }

    async function joinTeam(teamID, teamName){
      try{
        await updateDoc(doc(db, "teams", teamID), {
            members: arrayUnion({name: userData.name, emailID: currentUser.email, uid: currentUser.uid})
        });
        //console.log("Added member with teamID: ", teamRef.id);
        showAlert("success", `You have been successfully connected to the team ${teamName}`)
        connectTeam(teamID, false)
      } catch (e) {
        //console.error("Error:", e);
      }
    }

    /* async function joinTeam(teamID){
      if(teamID.length === 0){
        showAlert("error", "Enter the Team ID first!")
        return false
      }
        try {
            const teamRef = doc(db, "teams", teamID);
            const docSnap = await getDoc(teamRef)
            const teamData = docSnap.data()
            if (docSnap.exists()) {
              if (teamData.members.length === 4){
                showAlert("error", "A team can have a maximum of 4 members only!" )
                return false
              }
              for (var member = 0 ; member < teamData.members.length ; member++){
                if (teamData.members[member].uid === currentUser.uid) {
                  showAlert("error", `It seems that you are already a member of the team ${teamData.teamName}`)
                  return false
                }
              }
            } else {
                console.log("team does not exist")
                showAlert("error", "Team ID does not exist!")
                return false
              }
            
            await updateDoc(doc(db, "teams", teamID), {
                members: arrayUnion({name: userData.name, emailID: currentUser.email, uid: currentUser.uid})
            });
            console.log("Added member with teamID: ", teamRef.id);
            showAlert("success", `You have been successfully connected to the team ${teamData.teamName}`)
            connectTeam(teamRef.id, false)
          } catch (e) {
            //console.error("Error:", e);
          }

    } */

    function showAlert(severity, message){
      setAlert({severity: severity, message: message, show: true})
    }

    function hideMessage(){
      setAlert("")
    }


    const values = {
        login,
        currentUser,
        logOut,
        createTeam,
        findTeam, 
        joinTeam,
        addUser,
        updateUser,
        updateTeam,
        team,
        userData,
        showAlert,
        navigate,
        hideMessage,
        Round1Submission
    }
    
    return (
      <ThemeProvider theme={Theme}>
        <AuthContext.Provider value={values}>
            {alert && <ShowAlert props={alert} hide ={hideMessage} />}
            {loading && <Loading />}
            {!loading && children}
        </AuthContext.Provider>
        </ThemeProvider>
    )
}

export default AuthContextProvider;