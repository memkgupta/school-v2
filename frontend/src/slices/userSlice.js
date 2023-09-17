import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../constants/global";

const userSlice = createSlice({name:'user',initialState:{user:{},status:"LOADING"},reducers:{
    getUser:(state,action)=>{
        state.user = action.payload;
    },
    setStatus:(state,action)=>{
state.status = action.payload;
    }
}});
export const {getUser,setStatus} = userSlice.actions;
export function getUserThunk(token){
    return async function getUserThunk(dispatch,getState){
        if(!token){
            dispatch(setStatus("COMPLETED"));
        }
try {
  
    const userReq = await axios.get(`${BASE_URL}/user/me`,{headers:{'Authorization':`Bearer ${token}`}})
    const response = userReq.data;
    dispatch(getUser(response.user));
    dispatch(setStatus("SUCCESS"));
    
} catch (error) {
    dispatch(setStatus("ERROR"));
}
finally{
    dispatch(setStatus("COMPLETED"));
}
    }
}

export default userSlice.reducer;