import React, { useContext, useState } from "react";
import "./authPage.styles.scss";
import logo from '../../assets/logo.png'
import banner from '../../assets/login_image.png'
import { Alert, Button, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firebaseDatabase } from "../../backend/firebaseHandler";
import { child, get, ref } from "firebase/database";
import context from "../../context/app-context";

const AuthPage = ({setCurrentState}) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [visibility, setVisibility] = useState(false)
    const [severityType, setSeverity] = useState("")
    const [loading, setLoading] = useState(false)
    const [user, setUserData] = useContext(context)
    const navigate = useNavigate()

    const handleLogin = () => {
        if (email === "") {
            setVisibility(true)
            setMessage("Please enter Email-Id")
            setSeverity("warning")
            return
        }
        if (password === "") {
            setVisibility(true)
            setMessage("Please enter Password")
            setSeverity("warning")
            return
        }

        setLoading(true)
        signInWithEmailAndPassword(firebaseAuth, email, password).then( async (userCredential) => {
            await get(child(ref(firebaseDatabase), "USER_ARCHIVE/"+userCredential.user.uid)).then((snap)=>{
                console.log("here", userCredential.user.uid)
                
                if (snap.exists()) {
                    console.log("here2")
                  if (snap.child("status").val() === "NEW") {
                    setCurrentState("PENDING")
                  } else if (snap.child("status").val() === "ACTIVE") {
                    setUserData(snap.val())
                    setCurrentState("HOME")
                  } else {
                    alert("Your account is disabled by the Admin. If you think this may have been a mistake, please contact the Admin.")
                    firebaseAuth.signOut()
                  }
                } else {
                  setCurrentState("LOGIN")
                }
              })
            navigate("/")
            setLoading(false)
        }).catch((error) => {
            setVisibility(true)
            console.log(error)
            setMessage("Invalid credentials")
            setSeverity("error")
            setLoading(false)
        })
    }

    return (
        <div className="login-container">
            <img src={logo} alt="estimation-tool" className="logo" />

            <div className="image-form-container">
                <div className="banner-container">
                    <img src={banner} alt="estimation-tool" className="banner-image" />
                </div>

                <div className="form-container">

                    <div className="section-one">
                        <p className="form-title">Welcome back</p>
                        <p className="sub-title">Please login to continue</p>

                        <p className="field-tag">Email-Id</p>
                        <input className="input-field" value={email} onChange={(event)=>{setEmail(event.target.value)}} />

                        <p className="field-tag">Password</p>
                        <input className="input-field" type={"password"} value={password} onChange={(event)=>{setPassword(event.target.value)}} />

                        <Button disabled={loading} style={loading?{backgroundColor:"#FFA481"}:{backgroundColor:"#FE5C1C"}} variant="contained" className="submit-button" onClick={handleLogin}>Login</Button>
                    </div>
                    
                    <div className="section-two">
                        <p className="question">Don't have an account?</p>
                        <p className="clickable" onClick={()=>{setCurrentState("SIGNUP")}} >Create account</p>
                    </div>
                </div>

               
            </div>
            
            <Snackbar anchorOrigin={{vertical:'top', horizontal:'right'}} open={visibility} autoHideDuration={3000} onClose={()=>{setVisibility(false)}}>
                <Alert onClose={()=>{setVisibility(false)}} severity={severityType} sx={{ width: '100%' }}>{message}</Alert>
            </Snackbar>
        </div>
    )
}

export default AuthPage;