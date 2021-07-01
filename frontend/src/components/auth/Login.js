import React, { useState, useContext, useEffect } from 'react'
// import { Link } from 'react-router-dom'

import AuthContext from '../../context/auth/AuthContext'


function Login(props) {

    const ctxAuth = useContext(AuthContext)
    const { authenticated, login} = ctxAuth

    const [userDataForm, setUserDataForm] = useState({
        email: "",
        password: ""
    })

    const { email, password } = userDataForm

    useEffect(() => {
        if (authenticated) {
            props.history.push('/')
        }
        return
    }, [authenticated, props.history])

    const monitorChanges = (event) => {
        setUserDataForm({
            ...userDataForm,
            [event.target.name]: event.target.value
        })
    }

    const sendData = (event) => {
        event.preventDefault()

        login({
            email,
            password
        })

        localStorage.setItem('email', email)
    }

    return (
        <div className="py-5 row d-flex justify-content-center">
            <div className="card" style={{width: '35rem'}}>
                <div className="card-body">
                    <h5 className="card-title">Login</h5>
                    <form onSubmit={(e) => {sendData(e)}}>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label mt-4">Email address</label>
                            <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder="Enter email" onChange={(e) => monitorChanges(e)} value={email}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="form-label mt-4">Password</label>
                            <input type="password" className="form-control" id="password" name="password" placeholder="Password" onChange={(e) => monitorChanges(e)} value={password} />
                        </div>
                        <div className="form-group pt-3">
                            <input type="submit" className="btn btn-outline-success" value="LogIn"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
