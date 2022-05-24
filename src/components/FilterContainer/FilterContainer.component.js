import { Button, Menu, MenuItem } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BottomEntryDrawer from "../BottomEntryDrawer/BottomEntryDrawer.component";
import './FilterContainer.styles.scss';
import { IoFilter } from 'react-icons/io5'

const FilterContainer = () => {
    const [showElevation, setShowElevation] = useState(false);
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset >= 76) {
                setShowElevation(true)
            }else {
                setShowElevation(false)
            }
        })
        if (!searchParams.get('filter')) {
            setSearchParams({filter: "all"});
        }
    }, [])

    const handleNavigation = (type) => {
        setSearchParams({filter: type})
    }
    
    return (
        <div className={`filter-container-container ${showElevation?"scrolled-state": ""}`}>
            <div className="filter-list-container">
                <Button style={{backgroundColor: searchParams.get('filter') === "all"?"#ccc":''}} onClick={ _ =>handleNavigation("all")} sx={{color:'#31373A', fontWeight:'600'}} >All</Button>
                <Button style={{backgroundColor: searchParams.get('filter') === "today"?"#ccc":''}} onClick={ _ =>handleNavigation("today")} sx={{color:'#31373A', fontWeight:'600', marginLeft:'30px'}} >Today</Button>
                <Button style={{backgroundColor: searchParams.get('filter') === "this-month"?"#ccc":''}} onClick={ _ =>handleNavigation("this-month")} sx={{color:'#31373A', fontWeight:'600', marginLeft:'30px'}} >This month</Button>
            </div>
            
            <Button
              className="mobile-navigation-button"
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <IoFilter size={25} />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem style={{backgroundColor: searchParams.get('filter') === "all"?"#ccc":''}} onClick={ _ =>{ handleNavigation("all"); handleClose() }} sx={{color:'#31373A', fontWeight:'600'}} >All</MenuItem>
              <MenuItem style={{backgroundColor: searchParams.get('filter') === "today"?"#ccc":''}} onClick={ _ =>{ handleNavigation("all"); handleClose() }} sx={{color:'#31373A', fontWeight:'600'}} >My account</MenuItem>
              <MenuItem style={{backgroundColor: searchParams.get('filter') === "this-month"?"#ccc":''}} onClick={ _ =>{ handleNavigation("all"); handleClose() }} sx={{color:'#31373A', fontWeight:'600'}} >This month</MenuItem>
            </Menu>
            
            <BottomEntryDrawer />
        </div>
    )
}

export default FilterContainer;