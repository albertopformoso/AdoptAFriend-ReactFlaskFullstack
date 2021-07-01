import React, { useContext, useEffect } from 'react'
import Loader from 'react-loader-spinner'
import clientAxios from '../../config/axios'
import AuthContext from '../../context/auth/AuthContext'

import { Link } from 'react-router-dom'

import PetContext from '../../context/pets/PetContext'

function MyPets() {
    const ctxAuth = useContext(AuthContext)
    const { authenticated } = ctxAuth

    const petContext = useContext(PetContext)
    const { pets, obtainPets } = petContext

    useEffect (() => {
        const generateEvents = async () => {
            // console.log(`useEffect Call - ${value}`)
            await obtainPets('All')
            return
        }

        generateEvents()
    }, [obtainPets
    ])

    const deleteData = async (event) => {
        const url = `/api/pet/${event._id.$oid}`
        
        try{
            await clientAxios.delete(url)
        } catch(error){
            console.log(error)
        }
        
    }

    return (
        <div>
            {
                authenticated ? (
                    <div className="container py-3">
                        <h1>Your Pets</h1>
                        <div className="pt-1 d-flex flex-wrap"> {/*justify-content-between */}
                            {
                                pets.length === 0 ? (
                                    <div className="justify-content-between mt-5" style={{marginLeft: '45%'}}>
                                        <Loader type="ThreeDots" color="#B4B5B9" height={80} width={80} timeout={50000}/>
                                    </div>
                                )
                                :
                                
                                pets.map(e => {
                                    const petId = String(`/edit/${e._id.$oid}/${e.name}/${e.type}/${e.breed}/${e.sex}`)
                                    if (e.user_email === localStorage.getItem('email')) {
                                        return (
                                            <div className="p-3">
                                                <div className="card h-100" style={{width: '18rem'}}>
                                                    <img src={e.image_url[0]} className="card-img-top" alt={e.type}/>
                                                    <div className="card-body">
                                                        <h5 className="card-title">{e.name}</h5>
                                                        <p className="card-text">Breed: {e.breed}</p>
                                                        <div className="d-flex justify-content-between">
                                                            <Link to={petId} className="btn btn-info">Edit</Link>
                                                            <button className="btn btn-danger" onClick={(ev) => deleteData(e)}>Delete</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return <div></div>
                                })
                            }
                        </div>
                    </div>
                )
                :
                (
                    <div className="d-flex justify-content-center py-5">
                        <Loader type="ThreeDots" color="#B4B5B9" height={80} width={80} timeout={50000}/>
                        {/* <h3>403 — Forbidden Access</h3> */}
                    </div>
                )
            }
        </div>
    )
}

export default MyPets
