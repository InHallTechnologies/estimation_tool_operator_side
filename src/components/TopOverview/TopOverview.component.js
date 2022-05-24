import { Divider } from "@mui/material";
import React from "react";
import './TopOverview.styles.scss';

const TopOverview = ({ color, title, objects }) => {
    

    return(
        <div className='estimation-details-top-overview-container'>
            <div className="title-area">
                <div className="box-area" style={{backgroundColor: color}} />
                <h3 className="title">{title}</h3>
            </div>
            <Divider sx={{margin:'10px 0'}} />
            <div className="estimation-details-objects">
                {
                    objects.map(item => {
                        if (item.title) {
                            return(
                                <div key={item.title} className="objects-container">
                                    <h4 className="object-value">{item.value}</h4>
                                    <span className="object-title">{item.title}</span>
                                </div>
                            )
                        }else {
                            return null
                        }
                        
                    })
                }
            </div>
        </div>
    )
}

export default TopOverview;