import axios from 'axios'
import {urlApi} from './../support/urlApi'
import cookie from 'universal-cookie'

const objCookie = new cookie()
export const totalCart =(id)=>{
    return(dispatch)=>{
    
    axios.get(urlApi+'/cart?userId='+id)
    .then((res) => {
        if(res.data.length > 0){
            dispatch(
                {
                    type : 'GET_CART_SUCCESS',
                    payload : res.data
                }
            )
        }
    else{
        dispatch({
            type : 'CART_EMPTY',
        })
    }
        
    }).catch((err) => {
        dispatch({
            type : 'SYSTEM_ERROR'
        })
    });
    }
}