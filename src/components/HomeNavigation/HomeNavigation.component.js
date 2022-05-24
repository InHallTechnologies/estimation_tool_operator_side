import React, { useContext, useState } from "react";
import './HomeNavigation.styles.scss';
import logo from '../../assets/logo.png'
import { AiOutlineSearch } from 'react-icons/ai';
import { RiArrowDropDownFill } from 'react-icons/ri';
import { Link, useNavigate } from "react-router-dom";
import context from "../../context/app-context"
import SearchContext from "../../context/search-context";
import Logout from "../logout/Logout.component";
import LogoutLabel from "../logout/LogoutLabel.component";
import { IoArrowBack } from "react-icons/io5"

const HomeNavigation = ({ hideSearchBar, showBack }) => {
    const [User, setUser] = useContext(context)
    const [searchQuery, setSearchQuery] = useContext(SearchContext);
    const navigate = useNavigate()
    
    return (
        <div className="home-navigation-container">
            <div>
                {
                    showBack
                    ?
                    <IoArrowBack size={20} onClick={()=>{navigate("/")}} color="#FE5C1C" style={{marginBottom:20, marginRight:10, cursor:'pointer'}} />
                    :
                    null
                }
                <img className="home-navigation-icon" onClick={()=>{navigate("/")}} src={logo} alt="Data Collection" />
            </div>
            {
                hideSearchBar
                ?
                null
                :
                <div className="search-bar-container">
                    <AiOutlineSearch color="black" size={20} />
                    <input className="search-input" placeholder="Search here..." value={searchQuery} onChange={event => setSearchQuery(event.target.value)} />
                </div>
            }
            
            <div className="profile-drop-down">
                <LogoutLabel name={User.name} />
            </div>
        </div>
    )
}

export default HomeNavigation;