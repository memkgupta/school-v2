import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../constants/global";
import { useToken } from "../hooks/useCookie";

const teacherSlice = createSlice({name:'teacher',reducers:{
    loadTeachers:(state,action)=>{
state.teachers = action.payload;
    },
    removeTeacher:(state,action)=>{
        state.teachers.filter((teacher)=>{
            return teacher.id!=action.payload;
        })
    },
    addTeacher:(state,action)=>{
        state.teachers.push(action.payload);
    },
    updateTeacher:(state,action)=>{
        // state.teachers.find(teacher=>teacher.id = action.payload.id) = action.payload.data;
    }
},initialState:{teachers:[]}});

export const {loadTeachers,removeTeacher,updateTeacher,addTeacher} = teacherSlice.actions;
export function getTeachers(token){
    return async function(dispatch){
axios.get(`${BASE_URL}/teacher/`,{headers:{'Authorization':`Bearer ${useToken()}`}})
.then((res)=>{
    console.log(res.data)
const data = res.data;
dispatch(loadTeachers(data.teachers));
})
    }
}
export default teacherSlice.reducer;

