function PetReducer(state, action) {
    switch (action.type) {
        case "OBTAIN_PETS":
            return {
                ...state,
                pets: [...action.payload],
                pets2: [...action.payload2]
            }
        
            default:
                return state
    }
}

export default PetReducer

