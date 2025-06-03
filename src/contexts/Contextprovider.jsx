import React, { createContext, useReducer } from 'react'
import Cartreducer from './Cartreducer';

export const cartcontext = createContext();

const Contextprovider = ({children}) => {
    const [cart,dispatch]=useReducer(Cartreducer,[])
    return (
        <cartcontext.Provider value={{cart,dispatch}}>
            {children}
        </cartcontext.Provider>
    )
}

export default Contextprovider


