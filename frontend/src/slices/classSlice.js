import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../constants/global";

const classSlice = createSlice({name:'class',initialState:{classes:[]},reducers:{
    loadClasses:(state,action)=>{
state.classes = action.payload;
    }
}});
export const {loadClasses} = classSlice.actions;
export function loadClassThunk(token){
    return async function(dispatch){
        try {
            const res = await axios.get(`${BASE_URL}/class/`,{headers:{'Authorization':`Bearer ${token}`}});
             const data = res.data;
            dispatch(loadClasses(data.classes));
        } catch (error) {
            console.log(error.message);
        }
    }
}
export default classSlice.reducer;