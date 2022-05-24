import { Divider } from "@mui/material";
import React from "react";
import './EntriesArch.styles.scss';
import { AiOutlineCalendar, } from 'react-icons/ai'
import { BiPound } from 'react-icons/bi';
import { Link } from "react-router-dom";

const EntriesArch = ({ item }) => {

    const { projectName, projectDescription, estimatedTime, estimatedTotalCost, date, time, key } = item;

    function numberWithCommas(x) {
        return parseFloat(x).toLocaleString('en-IN');
    }

    return (
        <Link style={{ textDecoration:'none', color:'black' }} to={`/${key}`}>
            <div className="entries-arch-container">
                <h3 className="entries-arch-name">{projectName}</h3>
                <p className="entries-arch-description">{projectDescription}</p>
                <Divider />
                <div className="entries-arch-details-stamps-list">
                    <div className="entries-arch-details-stamps">
                        <AiOutlineCalendar size={16} />
                        <span className="entries-arch-details-stamps-value" >{numberWithCommas(estimatedTime.days)} Days</span>
                    </div>

                    <div className="entries-arch-details-stamps">
                        <BiPound size={16} />
                        <span className="entries-arch-details-stamps-value" >{numberWithCommas(estimatedTotalCost)} GBP</span>
                    </div>
                </div> 
                <span className="entries-arch-timestamp">{`${date}, ${time}`}</span>
            </div>
        </Link>
        
    )
}

export default EntriesArch;