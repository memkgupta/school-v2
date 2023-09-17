import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../constants/global";

const studentSlice = createSlice({name:'student',initialState:{status:"LOADING",students:[],total:0},reducers:{
    setTotal:(state,action)=>{
state.total  = action.payload;
    },
    getStudents:(state,action)=>{
        state.students = action.payload;
    },
    updateStudents:(state,action)=>{
        state.students = action.payload;
    },
   setStatus:(state,action)=>{
    state.status = action.payload;
   }
}});

export const {getStudents,updateStudents,setStatus,setTotal} = studentSlice.actions;

export function getStudentsThunk(token,page){
    return async function(dispatch,getState){
        dispatch(setStatus("LOADING"));
        try {
        const res = await axios.get(`${BASE_URL}/student/all?page=${page?page:1}`,{headers:{'Authorization':`Bearer ${token}`}});
            const data = res.data;
            console.log(data)
            dispatch(getStudents(data.students));
            dispatch(setTotal(data.total));
            dispatch(setStatus("SUCCESS"))
        } catch (error) {
            dispatch(setStatus("ERROR"))
        }

    }
}

export default studentSlice.reducer;