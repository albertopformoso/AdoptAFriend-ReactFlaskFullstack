import React, { useReducer } from 'react'

import PetContext from './PetContext'
import PetReducer from './PetReducer'

import clientAxios from '../../config/axios'

const PetState = props => {
    // A. INITIAL STATE
    const initialState = {
        pets: [],
        pets2: []
    }

    // B. REDUCER Configuration
    const [state, dispatch] = useReducer(PetReducer, initialState)

    // C. SELF FUNCTIONS
    const obtainPets = async (type) => {
        try {
            const results = await clientAxios.get(`/api/pets/${type}`)
            const results2 = await clientAxios.get(`api/pets/All`)
            dispatch({
                type: 'OBTAIN_PETS',
                payload: results.data,
                payload2: results2.data
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
                pets: state.pets,
                pets2: state.pets2,
                obtainPets
            }}
        >
            {props.children}
        </PetContext.Provider>
    )
}

export default PetState