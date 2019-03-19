const INITIAL_STATE = {totalCart :0}

export default (state=INITIAL_STATE,action) => {
    switch(action.type){
        case 'GET_CART_SUCCESS':
            return{...INITIAL_STATE ,
                totalCart : action.payload
            }
        case 'CART_EMPTY':
            return{...INITIAL_STATE}
        default :
            return state
    }
}