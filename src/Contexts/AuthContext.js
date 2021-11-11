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

    initializeApp(firebaseConfig);
    const auth = getAuth();
    const db = getFirestore();
    
    let navigate = useNavigate()
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user)
                getUserData(user)
            } else {
                console.log("No user exist")
                setLoading(false)
                navigate("/login")
            }
        })
        
        const getUserTeam = async (teamID) => {
          try {
            const teamData = await getDoc(doc(db, "teams", teamID));
            const temp = teamData.data()
            if(!teamData.data()){ 
              navigate("/team")
            }
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
              navigate("/signup", { replace: true })
              setLoading(false)
            }else if(temp.teamID){
              await getUserTeam(temp.teamID)
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
      var provider =  new GoogleAuthProvider()
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
      navigate("/login")

      }).catch((error) => {
      console.log(error)
      })
    }

    /* async function getUserData(){
      try {
          const userRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(userRef)
          const temp = docSnap.data()
          if (docSnap.exists()) {
              setUserData(temp)
              console.log("Userdata", userData)
              const teamRef = doc(db, "teams", temp.teamID);
              const docSnap = await getDoc(teamRef)
              const teamData = docSnap.data()
              console.log(teamData)
              setTeam(teamData)
              setLoading(false)
            } else {
              console.log("Data not exists")
          }
        } catch (e) {
          console.error("Error:", e);
      }
    }
 */
    

    /* async function getUserTeam(){
      try {
          console.log(userData.teamID)
          const teamRef = doc(db, "teams", userData.teamID);
          const docSnap = await getDoc(teamRef)
          const teamData = docSnap.data()
          setTeam(teamData)
          console.log(teamData)
          return true
        } catch (e) {
          console.error("Error:", e);
        }
  } */
    
    /* async function checkifNewUser(){
        try {
            const userRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(userRef)
            if (docSnap.exists()) {
                console.log("Data exists")
                if (window.location.pathname == "/signup"){
                    navigate("/team", { replace: true })
                }
              } else {
                console.log("Data not exists")
                navigate("/signup", { replace: true })
            }
          } catch (e) {
            console.error("Error:", e);
        }
    } */


    

    
    async function createTeam(name){
        if(name.length === 0){
          showAlert("error", "Enter the team name first!")
          return false
        }
        try {
            const docRef = await addDoc(collection(db, "teams"), {
              teamName: name,
              leader: {name: currentUser.displayName, email: currentUser.email, uid: currentUser.uid},
              members: [{name: currentUser.displayName, emailID: currentUser.email, uid: currentUser.uid}]
            });
            console.log("Team created with ID: ", docRef.id);
            setAlert({severity: "success", message: "New team has been successfully created!", show: true})
            connectTeam(docRef.id)
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }

    async function Round1Submission(data){
      try {
          await setDoc(doc(db, "teams", userData.teamID), {round1: data});
          //console.log("User added with ID: ", docRef.id);
          //navigate("/team", {replace: true})
        } catch (e) {
          console.error("Error adding user: ", e);
        }
    }

    async function addUser(data){
      try {
          await setDoc(doc(db, "users", currentUser.uid), {uid: currentUser.uid, ...data});
          showAlert("success", "Data has been uploaded successfully!")
          navigate("/team", {replace: true})
        } catch (e) {
          console.error("Error adding user: ", e);
        }
    }

    async function connectTeam(teamID){
      console.log(teamID)
      try {
          await updateDoc(doc(db, "users", currentUser.uid), {teamID : teamID});
          window.location.reload()
          //window.location.pathname = "/profile"
          //console.log("User added with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding user: ", e);
        }
    }

    async function updateUser(data){
      try {
          await updateDoc(doc(db, "users", currentUser.uid), {uid: currentUser.uid, ...data});
          showAlert("success", "Profile has been updated successfully")
        } catch (e) {
          console.error("Error adding user: ", e);
        }
    }

    async function updateTeam(newName){
      if(team.teamName !== newName){
        try {
          await updateDoc(doc(db, "teams", userData.teamID), {teamName: newName});
          //console.log("User added with ID: ", docRef.id);
          showAlert("success", "Team name has been updated successfully")
        } catch (e) {
          console.error("Error updating team name: ", e);
        }
      }else{
        showAlert("error","New team name cannot be same as current team name.")
      }
    }
    

    async function joinTeam(teamID){
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
                showAlert("error", "Team ID does not exist")
                return false
              }
            
            await updateDoc(teamRef, {
                members: arrayUnion({name: currentUser.displayName, emailID: currentUser.email, uid: currentUser.uid})
            });
            console.log("Added member with teamID: ", teamRef.id);
            showAlert("success", `You have been successfully connected to the team ${teamData.teamName}`)
            connectTeam(teamRef.id)
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