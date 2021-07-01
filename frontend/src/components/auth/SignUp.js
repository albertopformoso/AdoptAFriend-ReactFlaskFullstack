import React, { useState, useContext, useEffect } from 'react'
// import { Link } from 'react-router-dom'

import AuthContext from '../../context/auth/AuthContext'


export default function SignUp(props) {

    const ctxAuth = useContext(AuthContext)
    console.log(ctxAuth)
    const {authenticated, registerUser } = ctxAuth

    const [userDataForm, setUserDataForm] = useState({
        uname: "",
        email: "",
        password: "",
        pconfirm: ""
    })

    const { uname, email, password, pconfirm } = userDataForm

    useEffect(() => {
        if (authenticated === false) {
            props.history.push('/login')
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

        if (password !== pconfirm) {
            return console.log("Different passwords")
        }

        registerUser({
            uname,
            email,
            password,
            pconfirm
        })
    }

    return (
        <div className="py-5 row d-flex justify-content-center">
            <div className="card" style={{width: '35rem'}}>
                <div className="card-body">
                    <h5 className="card-title">SignUp</h5>
                    <h6 className="card-subtitle mb-2 text-muted">Please fill all the fields</h6>
                    <form onSubmit={(e) => {sendData(e)}}>
                        <div className="form-group">
                            <label htmlFor="uname" className="form-label mt-4">User name</label>
                            <input type="text" className="form-control" id="uname" name="uname" placeholder="Enter username" onChange={(e) => monitorChanges(e)} value={uname}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label mt-4">Email address</label>
                            <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder="Enter email" onChange={(e) => monitorChanges(e)} value={email} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="form-label mt-4">Password</label>
                            <input type="password" className="form-control" id="password" name="password" placeholder="Type your password" onChange={(e) => monitorChanges(e)} value={password} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pconfirm" className="form-label mt-4">Confirm password</label>
                            <input type="password" className="form-control" id="pconfirm" name="pconfirm" placeholder="Confirm password" onChange={(e) => monitorChanges(e)} value={pconfirm} />
                        </div>
                        <div className="form-group pt-3">
                            <input type="submit" className="btn btn-outline-success" value="Create Account" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
