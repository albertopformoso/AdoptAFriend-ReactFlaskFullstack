function AuthReducer(state, action) {
    switch (action.type) {
        case "SUCCESFUL_SIGNUP":
            localStorage.setItem('token', action.payload.token)
            return {
                ...state,
                authenticated: false
            }
        
        case "SUCCESFUL_LOGIN":
            console.log('=====SUCCESFUL_LOGIN=====')
            // console.log(action.payload)
            // console.log(`JWT ${action.payload.access_token}`)
            // console.log('=========================')
            localStorage.setItem('token', `JWT ${action.payload.access_token}`)
            return {
                ...state,
                authenticated: true
            }
        
        case "GET_USER":
            return {
                ...state,
                authenticated: true
            }
        
        case "LOGOUT":
            localStorage.removeItem('token')
            localStorage.removeItem('email')
            return {
                ...state,
                user: null,
                authenticated: null,
                message: null
            }
        
        default:
            return state
    }
}

export default AuthReducer