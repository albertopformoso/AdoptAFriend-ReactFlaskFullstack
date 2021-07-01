import React, { useContext, useState, 
    // useEffect 
} from 'react'
import axios from 'axios'
import clientAxios from '../../config/axios'
import Loader from 'react-loader-spinner'
import AuthContext from '../../context/auth/AuthContext'

function AddPet(props) {

    const ctxAuth = useContext(AuthContext)
    const { authenticated } = ctxAuth

    const [petDataForm, setPetDataForm] = useState({
        user_email: localStorage.getItem('email'),
        name: "",
        breed: "",
        type: "Dog",
        sex: "Male",
        image_url: null
    })

    const { name, breed, type, sex, image_url } = petDataForm

    const uploadImage = async (files) => {
        console.log(files)
        const formData = new FormData()
        formData.append('file', files[0])
        formData.append('upload_preset', 'prqwubqn')
        try {
            const url = await axios.post('https://api.cloudinary.com/v1_1/dmmhvh1ai/image/upload', formData)
            setPetDataForm({
                ...petDataForm,
                image_url: [url.data.secure_url]
            })
        } catch (error) {
            console.log(error)
        }
    }

    const monitorChanges = (event) => {
        setPetDataForm({
            ...petDataForm,
            [event.target.name]: event.target.value
        })
        // console.log(petDataForm)
    }

    const monitorImage = (event) => {
        uploadImage(event.target.files)
    }

    const sendData = async (event) => {
        event.preventDefault()
        if (image_url) {
            try {
                await clientAxios.post('/api/pet', petDataForm)
            } catch (error) {
                console.log(error)
            }
            props.history.push('/mypets')
        } else {
            return
        }

    }
    return (
        <div>
            {
                authenticated ? (
                    <div className="py-5 row d-flex justify-content-center">
                        <div className="card" style={{width: '35rem'}}>
                            <div className="card-body">
                                <h5 className="card-title">Add Pet</h5>
                                <form onSubmit={(e) => {sendData(e)}}>
                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label mt-4">Pet name</label>
                                        <input type="text" className="form-control" id="name" name="name" placeholder="Type the name of the pet" onChange={(e) => monitorChanges(e)} value={name}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="type" className="form-label mt-4">Select type of pet</label>
                                        <select className="form-select" id="type" name="type" onChange={(e) => monitorChanges(e)} value={type}>
                                            <option value="Dog" >Dog</option>
                                            <option value="Cat">Cat</option>
                                            <option value="Reptile">Reptile</option>
                                            <option value="Bird">Bird</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="breed" className="form-label mt-4">Breed</label>
                                        <input type="text" className="form-control" id="breed" name="breed" placeholder="Type the breed of the pet" onChange={(e) => monitorChanges(e)} value={breed} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="sex" className="form-label mt-4">Pet sex</label>
                                        <select className="form-select" id="sex" name="sex" onChange={(e) => (monitorChanges(e))} value={sex} >
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Unknown</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="image_url" className="form-label mt-4">Upload image</label>
                                        <input className="form-control" type="file" id="image_url" name="image_url" accept="image/*" onChange={(e) => monitorImage(e)}/>
                                        <small id="uploadHelp" className="form-text text-muted" >Select all the pictures to upload</small>
                                    </div>
                                    <div className="form-group pt-3">
                                        <input type="submit" className="btn btn-outline-success" value="Add Pet"/>
                                    </div>
                                </form>
                            </div>
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

export default AddPet
