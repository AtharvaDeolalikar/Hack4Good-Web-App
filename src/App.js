import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { initializeApp } from "firebase/app";
import firebaseConfig from "./config";
import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, onAuthStateChanged, updateProfile} from "firebase/auth";
import './App.css';
import Dashboard from "./Dashboard";

function App() {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();

  const provider = new GoogleAuthProvider();
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user)
        setCurrentUser(user)
        setLoading(false)
      } else {
        console.log("No user exist")
        setLoading(false)
        login()
      }
    })
  }, [])

  function login(){
    signInWithRedirect(auth, provider);
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
      window.location = "https://ieee-cis-sbc.org"
    }).catch((error) => {
      console.log(error)
    })
  }

  const authFunctions = {
    login : login,
    currentUser: currentUser,
    logOut: logOut
  }

  if (!loading && currentUser){
    return (
      <Routes>
        <Route path="/" element={<Dashboard authFunctions={authFunctions}/>}>
        </Route>
      </Routes>
    )} else {
    return "Loading..."
  }
}

export default App;
