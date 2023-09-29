import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../config";
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router";
import ShowAlert from "../ShowAlert";
import Loading from "../Loading";
import { ThemeProvider } from "@mui/material/styles";
import Theme from "./Theme";
import axios from "axios";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

initializeApp(firebaseConfig);

//console.log(process.env.REACT_APP_EMAIL_API, process.env.REACT_APP_EMAIL_KEY);

function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [userData, setUserData] = useState();
  const [team, setTeam] = useState();
  const [alert, setAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState({ navigate: null });
  const [publicSettings, setPublicSettings] = useState();

  const auth = getAuth();
  const db = getFirestore();
  const provider = new GoogleAuthProvider();

  let navigate = useNavigate();

  useEffect(() => {
    const getUserTeam = async (teamID) => {
      try {
        const teamData = await getDoc(doc(db, "teams", teamID));
        const temp = teamData.data();
        setTeam(temp);
      } catch (e) {
        console.log(e);
      }
    };

    const getPublicSettings = async () => {
      try {
        const teamData = await getDoc(doc(db, "settings", "public"));
        const temp = teamData.data();
        setPublicSettings(temp);
      } catch (e) {
        console.log(e);
      }
    };

    const getUserData = async (uid) => {
      try {
        const userData = await getDoc(doc(db, "users", uid));
        const temp = userData.data();
        setUserData(temp);
        if (!temp) {
          if (window.location.pathname === "/team/join") {
            setRedirect({
              navigate: window.location.pathname + window.location.search,
            });
          }
          showAlert("info", "Kindly sign up by filling your information");
          navigate("/signup");
        } else if (temp.connectedWithTeam) {
          await getUserTeam(temp.teamID);
        }
        /* if(temp){
            navigate('/dashboard')
          } */
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        getUserData(user.uid);
        getPublicSettings();
      } else {
        login();
      }
    });
  }, [auth, db, navigate]);

  function login() {
    /* signInWithPopup(auth, provider)
      .then((result) => {
        setCurrentUser(result.user);
      })
      .catch((error) => {
        console.log(error);
      }); */

    signInWithPopup(auth, provider);
    getRedirectResult(auth)
      .then((result) => {
        setCurrentUser(result?.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function logOut() {
    signOut(auth)
      .then(() => {
        window.location.href = "http://hack4good.ieee-cis-sbc.org";
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function createTeam(name) {
    if (name.length === 0) {
      showAlert("error", "Enter the team name first!");
      return false;
    }

    try {
      const tempData = {
        teamName: name,
        createdAt: serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),
        submission: {
          submitted: false,
          problemStatementID: "",
          projectTitle: "",
          projectDescription: "",
          contribution: "",
          projectLinks: {
            githubRepo: "",
            videoDemo: "",
            deployed: "",
            dataset: "",
          },
          technologiesUsed: [],
        },
        members: [
          {
            firstName: userData.firstName,
            lastName: userData.lastName,
            emailID: currentUser.email,
            uid: currentUser.uid,
            teamLeader: true,
          },
        ],
      };
      const docRef = await addDoc(collection(db, "teams"), tempData);
      setTeam(tempData);
      setAlert({
        severity: "success",
        message:
          "New team has been successfully created. Now you can invite people to join your team!",
        show: true,
      });
      connectTeam(docRef.id, true);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async function makeSubmission(data) {
    try {
      const tempData = {
        submission: {
          ...data,
          submitted: true,
          lastUpdatedAt: serverTimestamp(),
          lastUpdatedByUID: currentUser.uid,
        },
      };
      await updateDoc(doc(db, "teams", userData.teamID), tempData);
      setTeam({ ...team, ...tempData });

      const memberEmails = [];
      team.members.map((member) => {
        if (!member.teamLeader) {
          memberEmails.push(member.emailID);
        }
      });

      var teamLeader = team.members.find((item) => item.teamLeader === true);

      /* axios
        .post(process.env.REACT_APP_EMAIL_API + "submission", {
          data: {
            teamName: team.teamName,
            projectTitle: data.projectTitle,
            updatedByfirstName: userData.firstName,
            updatedBylastName: userData.lastName,
          },
          recipients: {
            to: teamLeader.emailID,
            cc: memberEmails,
          },
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        }); */

      showAlert(
        "success",
        "Your submission has been saved successfully. However you can make the changes before the deadline."
      );
    } catch (e) {
      console.error("Error adding user: ", e);
    }
  }

  async function getAllTeams() {
    const querySnapshot = await getDocs(collection(db, "teams"));
    const teams = [];
    var index = 0;
    querySnapshot.forEach((doc) => {
      teams.push({ ...doc.data(), id: doc.id, index });
      index = index + 1;
      //console.log(doc.id, " => ", doc.data());
    });
    return teams;
  }

  async function addUser(data) {
    try {
      const newUserData = {
        ...data,
        uid: currentUser.uid,
        connectedWithTeam: false,
        registeredAt: serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),
        addressConfirmation: false,
      };
      await setDoc(doc(db, "users", currentUser.uid), newUserData);
      setUserData(newUserData);
      showAlert("success", "You have been signed up successfully!");

      /* axios
        .post(process.env.REACT_APP_EMAIL_API + "signup", {
          data: {
            firstName: data.firstName,
          },
          recipients: {
            to: currentUser.email,
          },
        })
        .catch(function (error) {
          console.log(error);
        }); */
      if (redirect.navigate) {
        navigate(redirect.navigate);
      } else {
        navigate("/dashboard");
      }
    } catch (e) {
      console.error("Error adding user: ", e);
    }
  }

  async function connectTeam(teamID, teamLeader) {
    try {
      const tempData = {
        connectedWithTeamAt: serverTimestamp(),
        connectedWithTeam: true,
        teamLeader: teamLeader,
        teamID: teamID,
      };
      await updateDoc(doc(db, "users", currentUser.uid), tempData);
      setUserData({ ...userData, ...tempData });
      if (window.location.pathname !== "/team") {
        navigate("/team");
      } else {
        window.location.reload();
      }
    } catch (e) {
      console.error("Error adding user: ", e);
    }
  }

  async function updateUser(data) {
    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        ...data,
        lastUpdatedAt: serverTimestamp(),
      });
      if (userData.teamID) {
        const tempRef = await getDoc(doc(db, "teams", userData.teamID));
        const temp = tempRef.data();
        const tempArray = temp.members;
        for (var member = 0; member < temp.members.length; member++) {
          //console.log(tempArray[member].uid, currentUser.uid)
          if (tempArray[member].uid === currentUser.uid) {
            tempArray[member] = {
              firstName: data.firstName,
              lastName: data.lastName,
              emailID: currentUser.email,
              uid: currentUser.uid,
              teamLeader: userData.teamLeader,
            };
            await updateDoc(doc(db, "teams", userData.teamID), {
              members: tempArray,
            });
          }
        }
      }
      setUserData({ ...data });
      showAlert("success", "Profile has been updated successfully");
    } catch (e) {
      console.error("Error adding user: ", e);
    }
  }

  async function addAddress(data) {
    try {
      setUserData({ ...userData, ...data });
      await updateDoc(doc(db, "users", currentUser.uid), {
        ...data,
        lastUpdatedAt: serverTimestamp(),
      });
      showAlert("success", "Shipping details has been submitted successfully!");
    } catch (e) {
      console.error("Error adding user: ", e);
    }
  }

  /* async function updateTeam(newName) {
    if (team.teamName !== newName) {
      try {
        await updateDoc(doc(db, "teams", userData.teamID), {
          lastUpdatedAt: serverTimestamp(),
          teamName: newName,
        });
        setTeam({ ...team, teamName: newName });
        showAlert("success", "Team name has been updated successfully");
        axios
          .get("https://hack4goodbackend-atharvadeolalikar.vercel.app", {
            params: {
              to: currentUser.email,
              subject: `Your updated team is ${newName}`,
              body: {},
            },
          })
          .catch(function (error) {
            console.log(error);
          });
      } catch (e) {
        console.error("Error updating team name: ", e);
      }
    } else {
      showAlert("error", "New team name cannot be same as current team name.");
    }
  } */

  async function findTeam(teamID) {
    if (teamID.length === 0) {
      showAlert("error", "Enter the Team ID first!");
      return false;
    }
    if (userData.connectedWithTeam) {
      showAlert("error", "You are already a member of a team!");
      return false;
    }
    try {
      const teamRef = doc(db, "teams", teamID);
      const docSnap = await getDoc(teamRef);
      const teamData = docSnap.data();

      if (docSnap.exists()) {
        if (teamData.members.length === 4) {
          showAlert("error", "A team can have a maximum of 4 members only!");
          return false;
        }
        return teamData.teamName;
      } else {
        showAlert("error", "Team ID does not exist!");
        return false;
      }
    } catch (e) {
      console.error("Error in finding team", e);
    }
  }

  async function joinTeam(teamID, teamName) {
    try {
      await updateDoc(doc(db, "teams", teamID), {
        members: arrayUnion({
          firstName: userData.firstName,
          lastName: userData.lastName,
          emailID: currentUser.email,
          uid: currentUser.uid,
          teamLeader: false,
        }),
      });

      /* var teamLeader = team.members.find((item) => item.teamLeader === true);

      axios
        .post(process.env.REACT_APP_EMAIL_API + "teamJoin", {
          data: {
            leaderFirstName: teamLeader.firstName,
            teamName: team.teamName,
            firstName: userData.firstName,
            lastName: userData.lastName,
            emailID: currentUser.email,
          },
          recipients: {
            to: teamLeader.emailID,
          },
        })
        .catch(function (error) {
          console.log(error);
        }); */

      showAlert("success", `You have successfully joined the team ${teamName}`);
      connectTeam(teamID, false);
    } catch (e) {
      console.error("Error:", e);
    }
  }

  function showAlert(severity, message) {
    setAlert({ severity: severity, message: message, show: true });
  }

  function hideMessage() {
    setAlert("");
  }

  const values = {
    login,
    currentUser,
    getAllTeams,
    publicSettings,
    logOut,
    createTeam,
    findTeam,
    joinTeam,
    addUser,
    updateUser,
    addAddress,
    team,
    userData,
    showAlert,
    navigate,
    hideMessage,
    makeSubmission,
  };

  return (
    <ThemeProvider theme={Theme}>
      <AuthContext.Provider value={values}>
        {alert && <ShowAlert props={alert} hide={hideMessage} />}
        {loading && publicSettings && <Loading />}
        {!loading && publicSettings && children}
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default AuthContextProvider;
