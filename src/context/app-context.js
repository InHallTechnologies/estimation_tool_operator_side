import React, { createContext, useState } from 'react'
import userSample from '../Entities/userEntity'

const context = createContext()

export const Provider = ({children}) => {
    const [userData, setUserData] = useState(userSample)
    return(
        <context.Provider value={[userData, setUserData]}>
            {children}
        </context.Provider>
    )
} 

export default context