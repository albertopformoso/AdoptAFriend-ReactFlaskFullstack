import axios from 'axios'

const clientAxios = axios.create({
    baseURL: 'https://be-aaf.herokuapp.com'
})

export default clientAxios