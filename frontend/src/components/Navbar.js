import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'

import AuthContext from '../context/auth/AuthContext'

function Navbar(props) {
    const ctxAuth = useContext(AuthContext)
    const { authenticated, logout, verifyUser } = ctxAuth

    let history = useHistory()
    const redirect = () => {
        history.push('/')
    }

    window.addEventListener('load', () => {
        verifyUser()
    })

    const sendData = (event) => {
        event.preventDefault()
        logout()
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid px-5">
                <Link className="navbar-brand" to="/">Adopt</Link>
                <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="navbar-collapse collapse" id="navbarColor03">
                    {
                        authenticated ? (
                            <ul className="navbar-nav me-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" aria-current="page" to="/addpet">Add pet</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" aria-current="page" to="/mypets">My pets</Link>
                                </li>
                            </ul>
                        )
                        :
                        (
                            <ul className="navbar-nav me-auto">
                                <li className="nav-item">
                                    <div></div>
                                </li>
                            </ul>
                        )
                    }
                    {
                        authenticated ? (
                            <div>
                                <form onSubmit={(e) => {sendData(e)}}>
                                    <input type="submit" className="btn btn-outline-danger btn-sm" value="LogOut" onClick={redirect}/>
                                </form>
                            </div>
                        )
                        :
                        (
                        <div className="d-flex">
                            <div className="pe-2">
                                <Link className="btn btn-outline-dark btn-sm" to="/signup">SignUp</Link>
                            </div>
                            <div>
                                <Link className="btn btn-outline-dark btn-sm" to="/login">LogIn</Link>
                            </div>
                        </div>
                        )
                    }
                    
                </div>
            </div>
        </nav>
    )
}

export default Navbar
