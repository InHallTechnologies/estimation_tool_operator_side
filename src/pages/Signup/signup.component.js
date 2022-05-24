import React, { useState } from "react";
import "./signup.style.scss"
import logo from '../../assets/logo.png'
import banner from '../../assets/login_image.png'
import { Alert, Button, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import userEntity from "../../Entities/userEntity";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firebaseDatabase } from "../../backend/firebaseHandler";
import { ref, set } from "firebase/database";
import moment from 'moment';

const Signup = ({setCurrentState}) => {

    const [user, setUser] = useState(userEntity)
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [visibility, setVisibility] = useState(false)
    const [severityType, setSeverity] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSignup = () => {
        if (user.name === "") {
            setVisibility(true)
            setMessage("Please enter Name")
            setSeverity("warning")
            return
        }
        if (user.phoneNumber.length < 10) {
            setVisibility(true)
            setMessage("Please enter a valid Phone Number")
            setSeverity("warning")
            return
        }
        if (user.emailId === "") {
            setVisibility(true)
            setMessage("Please enter Email-Id")
            setSeverity("warning")
            return
        }
        if (password === "" || password.length < 8) {
            setVisibility(true)
            setMessage("Password must be at least 8 characters")
            setSeverity("warning")
            return
        }

        setLoading(true)
        createUserWithEmailAndPassword(firebaseAuth, user.emailId, password).then(async(userCredentials)=>{
            user.uid = userCredentials.user.uid
            user.status = "NEW"
            user.date = moment().format("Do MMMM YYYY")
            await set(ref(firebaseDatabase, "USER_ARCHIVE/"+userCredentials.user.uid), user)
            setCurrentState("PENDING")
        }).catch((error)=>{
            setVisibility(true)
            setMessage("Something went wrong. Please try again later or with a different Email-Id")
            setSeverity("error")
            setLoading(false)
        })
    }

    return(
        <div className="signup-container">
            <img src={logo} alt="estimation-tool" className="logo" />

            <div className="image-form-container">
                <div className="banner-container">
                    <img src={banner} alt="estimation-tool" className="banner-image" />
                </div>

                <div className="form-container">

                    <div className="section-one">
                        <p className="form-title">Create Account</p>
                        <p className="sub-title">Please create an account to continue</p>

                        <p className="field-tag">Name</p>
                        <input className="input-field" value={user.name} onChange={(event)=>{setUser({...user, name:event.target.value})}} />

                        <p className="field-tag">Phone Number</p>
                        <input className="input-field" maxLength={10} value={user.phoneNumber} onChange={(event)=>{setUser({...user, phoneNumber:event.target.value.replace(/[^0-9]/g, '')})}} />

                        <p className="field-tag">Email-Id</p>
                        <input className="input-field" value={user.emailId} onChange={(event)=>{setUser({...user, emailId:event.target.value})}} />

                        <p className="field-tag">Password</p>
                        <input className="input-field" type={'password'} value={password} onChange={(event)=>{setPassword(event.target.value)}} />

                        <Button variant="contained" className="submit-button" onClick={handleSignup}>Create Account</Button>
                    </div>
                </div>

               
            </div>
            
            <Snackbar anchorOrigin={{vertical:'top', horizontal:'right'}} open={visibility} autoHideDuration={3000} onClose={()=>{setVisibility(false)}}>
                <Alert onClose={()=>{setVisibility(false)}} severity={severityType} sx={{ width: '100%' }}>{message}</Alert>
            </Snackbar>
        </div>
    )
}

export default Signup