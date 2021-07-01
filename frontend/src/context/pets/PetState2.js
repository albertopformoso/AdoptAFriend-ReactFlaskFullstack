import React, { useReducer } from 'react'

import PetContext from './PetContext'
import PetReducer from './PetReducer'

import clientAxios from '../../config/axios'

const PetState2 = props => {
    // A. INITIAL STATE
    const initialState = {
        pets2: []
    }

    // B. REDUCER Configuration
    const [state, dispatch] = useReducer(PetReducer, initialState)

    // C. SELF FUNCTIONS
    const obtainPets2 = async (type) => {
        try {
            const results = await clientAxios.get(`/api/pets/All`)
            dispatch({
                type: 'OBTAIN_PETS',
                payload: results.data
            })
            
        } catch (error) {
            console.log(error)
            return
        }
    }

    // D. RETURN
    return (
        <PetContext.Provider
            value={{
                pets2: state.pets,
                obtainPets2
            }}
        >
            {props.children}
        </PetContext.Provider>
    )
}

export default PetState2