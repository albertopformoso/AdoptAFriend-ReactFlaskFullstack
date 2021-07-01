import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import clientAxios from '../../config/axios'

import Loader from 'react-loader-spinner'

export default function PetDetails() {
    const { id } = useParams()

    const [pet, setPet] = useState()

    const obtainPet = async (petId) => {
        try {
            const results = await clientAxios.get(`/api/pet/${petId}`)
            setPet(results.data)
        } catch (error) {
            console.error(error)
            return {'msg': 'Error getiting pet'}
        }
    }

    useEffect(() => {
        const generateEvents = async () => {
            await obtainPet(id)
            return
        }
        generateEvents()
    }, [id])

    if (pet === undefined) {
        return (<div className="d-flex justify-content-center py-5">
            <Loader type="ThreeDots" color="#B4B5B9" height={80} width={80} timeout={50000}/>
        </div>)
    } else {
        return (
            <div className="d-flex justify-content-center py-5">
                <div className="d-flex mb-3 shadow bg-white" style={{width: '800px'}}>
                    <div className="row">
                        <div className="col">
                            <img src={pet.image_url[0]} alt={pet.name} className="card-img-top h-100"/>
                        </div>
                        <div className="col p-4">
                            <div className="">
                                <h5 className="">Hi, my name is {pet.name}</h5>
                                <p className="">Breed: {pet.breed}</p>
                                <p className="">Sex: {pet.sex}</p>
                                <a href="https://www.adoptapet.com" className="btn btn-outline-info">Adopt Me!</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
