import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import PetContext from '../../context/pets/PetContext'

// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Loader from 'react-loader-spinner'

export default function PetListing() {
    const petContext = useContext(PetContext)
    const { pets, pets2, obtainPets } = petContext

    const [value, setValue] = useState('All')

    useEffect (() => {
        const generateEvents = async () => {
            // console.log(`useEffect Call - ${value}`)
            await obtainPets(value)
            return
        }

        generateEvents()
    }, [value, obtainPets
    ])

    const petTypes = [...new Set(pets2.map(e => e.type))]

    const onChange = (event) => {
        setValue(String(event.target.value))
    }

    return (
        <div className="container py-3">
            <h1>Pets Listing</h1>
            <div className="d-flex">
                <div>
                    <label for="exampleSelect1" className="form-label mt-4">Select by type:</label>
                    <select className="form-select" id="exampleSelect1" name="pet" onChange={(e) => {onChange(e)}}>
                        {
                        pets.length === 0 ? ""
                        :
                        petTypes.map(type => {
                            return (
                                <option key={type} value={type}>{type}s</option>
                            )
                        })
                        }
                        <option key="All" value="All">All</option>
                    </select>
                </div>
            </div>
            <div className="pt-1 d-flex flex-wrap"> {/*justify-content-between */}
                {
                    pets.length === 0 ? <div className="justify-content-between mt-5" style={{marginLeft: '45%'}}><Loader type="ThreeDots" color="#B4B5B9" height={80} width={80} timeout={50000}/></div>
                    :
                    pets.map(e => {
                        const petId = String('/detail/' + e._id.$oid)
                        return (
                            <div className="p-3">
                                <div className="card h-100" style={{width: '18rem'}}>
                                    <img src={e.image_url[0]} className="card-img-top" alt={e.type}/>
                                    <div className="card-body">
                                        <h5 className="card-title">{e.name}</h5>
                                        <p className="card-text">Breed: {e.breed}</p>
                                        <Link to={petId} className="btn btn-primary">Details</Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
