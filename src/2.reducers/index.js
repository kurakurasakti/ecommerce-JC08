import { combineReducers } from 'redux'
import User from './userGlobal'
import Product from './userGlobal'

export default combineReducers({
    user : User,
    Product : Product
})