import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import studentSlice from "./slices/studentSlice";
import classSlice from "./slices/classSlice";
import teacherSlice from "./slices/teacherSlice";

 const store = configureStore({reducer:{user:userSlice,student:studentSlice,class:classSlice,teacher:teacherSlice}})
export default store;
