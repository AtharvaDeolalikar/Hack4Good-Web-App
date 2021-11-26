import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../config";
import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, onAuthStateChanged} from "firebase/auth";
import { getFirestore , collection, addDoc, updateDoc, arrayUnion, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router";
import ShowAlert from "../ShowAlert";
import Loading from "../Loading";
import { ThemeProvider } from '@mui/material/styles'
import Theme from "./Theme";
import axios from "axios";

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
                login()
            }
        })
        
        const getUserTeam = async (teamID) => {
          try {
            const teamData = await getDoc(doc(db, "teams", teamID));
            const temp = teamData.data()
            setTeam(temp)
        }
          catch(e){
            console.log(e)
          }
        }

        const getUserData = async (user) => {
          try {
            const userData = await getDoc(doc(db, "users", user.uid));
            const temp = userData.data()
            setUserData(temp)
            if(!temp){
              if(window.location.pathname === "/team/join"){
                setRedirect({navigate: window.location.pathname + window.location.search})
                showAlert("info", "You'll require to sign up first!")
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
            const tempData = {
              teamName: name,
              createdAt: serverTimestamp(),
              round1: {submitted: false},
              round2: {submitted: false},
              members: [{name: currentUser.displayName, emailID: currentUser.email, uid: currentUser.uid, teamLeader: true}]
            }
            const docRef = await addDoc(collection(db, "teams"), tempData);
            setTeam(tempData)
            setAlert({severity: "success", message: "New team has been successfully created!", show: true})
            connectTeam(docRef.id, true)
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }

    async function Round1Submission(data){
      try {
        const tempData =  {
          round1 : {...data, submitted: true, lastUpdatedAt: serverTimestamp()}
        }
        await updateDoc(doc(db, "teams", userData.teamID), tempData)
        setTeam({...team, ...tempData})
        showAlert("success", "Your submission has been saved successfully. However you can make the changes before the deadline.")
      } catch (e) {
          console.error("Error adding user: ", e);
        }
    }

    async function addUser(data){
      try {
          const newUserData = {...data, uid: currentUser.uid, connectedWithTeam : false, registeredAt: serverTimestamp(), addressConfirmation: false}
          await setDoc(doc(db, "users", currentUser.uid), newUserData);
          setUserData(newUserData)
          showAlert("success", "You have been signed up successfully!")
          if(redirect.navigate){
            navigate(redirect.navigate)
          }else{
            navigate("/team", {replace: true})
          }
        } catch (e) {
          console.error("Error adding user: ", e);
        }
    }

    async function connectTeam(teamID, teamLeader){
      try {
          const tempData = {
            connectedWithTeamAt: serverTimestamp(), 
            connectedWithTeam: true, 
            teamLeader: teamLeader, 
            teamID : teamID
          }
          await updateDoc(doc(db, "users", currentUser.uid), tempData);
          setUserData({...userData, ...tempData})
          if(window.location.pathname === "/team"){
            window.location.reload()
          }else{
            navigate("/team")
          }
        } catch (e) {
          console.error("Error adding user: ", e);
        }
    }

    async function updateUser(data){
      try {
          setUserData({...data})
          await updateDoc(doc(db, "users", currentUser.uid), {...data, lastUpdatedAt: serverTimestamp()})
          if(userData.teamID){
            const tempRef = await getDoc(doc(db, "teams", userData.teamID))
            const temp = tempRef.data()
            const tempArray = temp.members
            for (var member = 0; member < temp.members.length ; member++){
              if(temp.members[member].uid === userData.uid){
                tempArray[member] = {name: data.name, emailID: currentUser.email, uid: currentUser.uid, teamLeader: userData.teamLeader}
                console.log("calling updateDoc with", {members: tempArray})
                await updateDoc(doc(db, "teams", userData.teamID), {members: tempArray})
              }
            }
          }
          showAlert("success", "Profile has been updated successfully")
        } catch (e) {
          console.error("Error adding user: ", e);
        }
    }

    async function addAddress(data){
      try {
        setUserData({...userData, ...data})
        await updateDoc(doc(db, "users", currentUser.uid), {...data, lastUpdatedAt: serverTimestamp()})
        showAlert("success", "Shipping details has been submitted successfully!")
      } catch (e) {
        console.error("Error adding user: ", e);
      }
    }

    async function updateTeam(newName){
      if(team.teamName !== newName){
        try {
          await updateDoc(doc(db, "teams", userData.teamID), {lastUpdatedAt: serverTimestamp(), teamName: newName})
          setTeam({ ...team, teamName : newName})
          showAlert("success", "Team name has been updated successfully")
          console.log(currentUser.email)
          axios.get('https://hack4goodbackend-atharvadeolalikar.vercel.app', {
            params: {
              to : currentUser.email,
              subject : `Your updated team is ${newName}`,
              body : `Hello! <br> 
              <b>${userData.name} </b> has recently updated the name of your team to <b>${newName}</b>.
              `
            }
          })
          .catch(function (error) {
            console.log(error);
          })
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
      if(userData.teamID){
        showAlert("error" , "You are already a member of a team!")
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
              return teamData.teamName
            } else {
                showAlert("error", "Team ID does not exist!")
                return false
              }

          } catch (e) {
            console.error("Error in finding team", e);
          }

    }

    async function joinTeam(teamID, teamName){
      try{
        await updateDoc(doc(db, "teams", teamID), {
            members: arrayUnion({name: userData.name, emailID: currentUser.email, uid: currentUser.uid, teamLeader: false})
        })
        showAlert("success", `You have been successfully connected to the team ${teamName}`)
        connectTeam(teamID, false)
      } catch (e) {
        //console.error("Error:", e);
      }
    }

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
        addAddress,
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