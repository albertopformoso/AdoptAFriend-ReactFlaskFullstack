import React, { useReducer } from 'react'

import clientAxios from '../../config/axios'
import tokenAuth from '../../config/token'

import AuthContext from './AuthContext'
import AuthReducer from './AuthReducer'

const AuthState = (props) => {
    // A. INITIAL STATE:
    const initialState = {
        message: null,
        authenticated: null,
        user: null,
    }

    // B. REDUCER CONFIGURATION:
    const [state, dispatch] = useReducer(AuthReducer, initialState)

    // C. STATE HANDLER FUNCTIONS:
    const registerUser = async (data) => {
        try {
            const response = await clientAxios.post('/api/user', data)

            dispatch({
                type: "SUCCESFUL_SIGNUP",
                payload: response.data
            })

            // verifyUser()

        } catch (error) {
            console.log(error)
        }
    }

    const verifyUser = async () => {
        const token = localStorage.getItem('token')
        // console.log('======TOKEN======')
        // console.log(token)
        // console.log('=================')

        if (token) {
            tokenAuth(token)
        } else {
            return
        }

        try {
            const response = await clientAxios.get('/api/user')

            dispatch({
                type: "GET_USER",
                payload: response.data
            })
        } catch (error) {
            console.log(error)
            return
        }
    }

    const login = async (data) => {
        try {
            const response = await clientAxios.post('/api/login', data)
            // console.log(response)
            // console.log(response.data.access_token)
            dispatch({
                type: "SUCCESFUL_LOGIN",
                payload: response.data
            })
        } catch (error) {
            console.log(error)
            return
        }

        verifyUser()
    }

    const logout = async () => {
        dispatch({
            type: "LOGOUT",
            payload: null
        })
    }

    // D. RETURN:
    return (
        <AuthContext.Provider
            value={{
                message: state.message,
                authenticated: state.authenticated,
                user: state.user,
                registerUser,
                login,
                logout,
                verifyUser
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthState