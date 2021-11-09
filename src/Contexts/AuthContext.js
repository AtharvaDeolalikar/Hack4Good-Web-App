import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../config";
import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, onAuthStateChanged} from "firebase/auth";
import { getFirestore , collection, addDoc, updateDoc, arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import ShowAlert from "../ShowAlert";
import Loading from "../Loading";

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
    const provider = new GoogleAuthProvider();
    let navigate = useNavigate()
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user)
                setCurrentUser(user)
                //checkifNewUser()
                getUserData(user)
            } else {
                console.log("No user exist")
                login()
            }
        })
        
        const getUserTeam = async (userData) => {
          try {
            const teamData = await getDoc(doc(db, "teams", userData.teamID));
            console.log(teamData.data())
            setTeam(teamData.data())
            setLoading(false)
        }
          catch(e){
            console.log(e)
            setLoading(false)
          }
        };

        const getUserData = async (user) => {
          try {
            const userData = await getDoc(doc(db, "users", user.uid));
            console.log("UserData",userData.data())
            if(userData.data()){
              console.log("YES")
              getUserTeam(userData.data())
            }else{
              console.log("No")
              navigate("/signup", { replace: true })
              setLoading(false)
            }
            setUserData(userData.data())
          }
          catch(e){
            console.log(e)
          }
        };
        
    }, []);

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
        try {
            const docRef = await addDoc(collection(db, "teams"), {
              teamName: name,
              leader: {name: currentUser.displayName, email: currentUser.email, uid: currentUser.uid},
              members: [{name: currentUser.displayName, emailID: currentUser.email, uid: currentUser.uid}]
            });
            console.log("Team created with ID: ", docRef.id);
            connectTeam(name, docRef.id)
            setAlert({severity: "success", message: "New team has been successfully created!", show: true})
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }

    async function addUser(data){
        try {
            const docRef = await setDoc(doc(db, "users", currentUser.uid), {uid: currentUser.uid, ...data});
            //console.log("User added with ID: ", docRef.id);
            navigate("/team", {replace: true})
          } catch (e) {
            console.error("Error adding user: ", e);
          }
    }

    async function connectTeam(teamName, teamID){
      try {
          const docRef = await updateDoc(doc(db, "users", currentUser.uid), {teamName: teamName, teamID : teamID});
          //console.log("User added with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding user: ", e);
        }
    }

    async function updateUser(data){
      try {
          const docRef = await updateDoc(doc(db, "users", currentUser.uid), {uid: currentUser.uid, ...data});
          //console.log("User added with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding user: ", e);
        }
    }

    async function updateTeam(id, newName){
      try {
          const docRef = await updateDoc(doc(db, "teams", id), {teamName: newName });
          //console.log("User added with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding user: ", e);
        }
    }
    

    async function joinTeam(teamID){
        console.log(teamID)
        try {
            const teamRef = doc(db, "teams", teamID);
            const docSnap = await getDoc(teamRef)
            const teamData = docSnap.data()
            if (docSnap.exists()) {
                teamData.members.map((member) => {
                  if (member.uid == currentUser.uid) {
                      throw "It seems that you are already a member of the team " + teamData.teamName;
                  }
                })
              } else {
                throw "Team does not exist!"
              }

            await updateDoc(teamRef, {
                members: arrayUnion({name: currentUser.displayName, emailID: currentUser.email, uid: currentUser.uid})
            });
            console.log("Added member with teamID: ", teamRef.id);
            connectTeam(teamData.teamName, teamRef.id)
          } catch (e) {
            console.error("Error:", e);
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
        team,
        userData,
        showAlert,
        hideMessage
    }
    
    return (
        <AuthContext.Provider value={values}>
            {alert && <ShowAlert props={alert} hide ={hideMessage} />}
            {loading && <Loading />}
            {!loading && children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;