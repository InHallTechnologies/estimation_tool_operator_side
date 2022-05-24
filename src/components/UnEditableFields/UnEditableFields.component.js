import React from 'react';
import './UnEditableFields.styles.scss';

const UnEditableFields = ({title, value}) => {

    return(
        <div className='uneditable-fields-container'>
            <h3 className='uneditable-field-title'>{title}</h3>
            <p className='uneditable-field-value'>{value}</p>
        </div>
    )
}

export default UnEditableFields;