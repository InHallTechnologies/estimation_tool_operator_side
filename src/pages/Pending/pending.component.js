import React from "react";
import "./pending.style.scss"
import logo from '../../assets/logo.png'
import pending from "../../assets/pending.png"
import { Button } from "@mui/material";

const Pending = ({setCurrentState}) => {

    const handleCLick = () => {
        setCurrentState("LOGIN")
        // window.location.reload()
    }

    return(
        <div className="pending-container">
            <img src={logo} alt="estimation-tool" className="logo" />

            <div className="pending-content-container">
                <img src={pending} alt="account-pending" className="pending-image" />
                <p className="pending-content">You account is under verification. Please try again in a little while.</p>
                <Button variant="contained" className="submit-button" onClick={handleCLick}>Login Again</Button>
            </div>
        </div>
    )
}

export default Pending