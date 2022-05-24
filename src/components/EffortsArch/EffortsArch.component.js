import React from 'react'
import './EffortsArch.styles.scss';

const EffortsArch = ({ value, title }) => {

    return (
        <div className='efforts-arch-container'>
            <h2 className='efforts-arch-value'>{value}</h2>
            <p className='efforts-arch-title'>{title}</p>
        </div>
    )
}

export default EffortsArch;