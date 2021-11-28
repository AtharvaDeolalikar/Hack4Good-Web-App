import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../config";
import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, onAuthStateChanged} from "firebase/auth";
import { getFirestore , collection, addDoc, updateDoc, arrayUnion, doc, getDoc, setDoc, serverTimestamp, getDocs } from "firebase/firestore";
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
            const userData = await getDoc(doc(db, "users", user.uid))
            const temp = userData.data()
            setUserData(temp)
            if(!temp){
              if(window.location.pathname === "/team/join"){
                setRedirect({navigate: window.location.pathname + window.location.search})
                showAlert("info", "You'll require to sign up first!")
              }
              navigate("/signup", { replace: true })
              setLoading(false)
            }else if(temp.isAdmin){
              navigate("/admin")
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
              lastUpdatedAt: serverTimestamp(),
              round1: {submitted: false},
              round2: {submitted: false},
              members: [{firstName: userData.firstName, lastName: userData.lastName, emailID: currentUser.email, uid: currentUser.uid, teamLeader: true}]
            }
            const docRef = await addDoc(collection(db, "teams"), tempData);
            setTeam(tempData)
            setAlert({severity: "success", message: "New team has been successfully created. Now you can invite people to join your team!", show: true})
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

    /* async function getAllUsers(){
      const querySnapshot = await getDocs(collection(db, "users"))
      const users = []
      querySnapshot.forEach((doc) => {
        users.push({...doc.data(), id: doc.id, "A": "B"})
        //console.log(doc.id, " => ", doc.data());
      })
      console.log(users)
      return users
    } */

    async function getAllTeams(){
      const querySnapshot = await getDocs(collection(db, "teams"))
      const teams = []
      querySnapshot.forEach((doc) => {
        teams.push({...doc.data(), id: doc.id})
        //console.log(doc.id, " => ", doc.data());
      })
      return teams
    }
    async function addUser(data){
      try {
          const newUserData = {...data, uid: currentUser.uid, connectedWithTeam : false, registeredAt: serverTimestamp(), lastUpdatedAt: serverTimestamp(), addressConfirmation: false}
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
          if(!window.location.pathname === "/team"){
            navigate("/team")
          }
        } catch (e) {
          console.error("Error adding user: ", e);
        }
    }

    async function updateUser(data){
      try {
          await updateDoc(doc(db, "users", currentUser.uid), {...data, lastUpdatedAt: serverTimestamp()})
          if(userData.teamID){
            const tempRef = await getDoc(doc(db, "teams", userData.teamID))
            const temp = tempRef.data()
            const tempArray = temp.members
            for (var member = 0; member < temp.members.length ; member++){
              console.log(tempArray[member].uid, currentUser.uid)
              if(tempArray[member].uid === currentUser.uid){
                tempArray[member] = {firstName: data.firstName, lastName: data.lastName, emailID: currentUser.email, uid: currentUser.uid, teamLeader: userData.teamLeader}
                await updateDoc(doc(db, "teams", userData.teamID), {members: tempArray})
              }
            }
          }
          setUserData({...data})
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
            members: arrayUnion({firstName: userData.firstName, lastName: userData.lastName, emailID: currentUser.email, uid: currentUser.uid, teamLeader: false})
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
        //getAllUsers,
        getAllTeams,
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