import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice'
import userRegisterReducer from './slices/userRegister'

const userInfoFromStorage = localStorage.getItem('userInfo')?
JSON.parse(localStorage.getItem('userInfo')): null

const store = configureStore({
    reducer: {

        userLogin: userReducer,
        userRegister: userRegisterReducer,
    },
    preloadedState: {

        userLogin: { userInfo: userInfoFromStorage } 
    }
});

export default store;