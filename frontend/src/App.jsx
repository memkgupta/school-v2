import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import { useToken } from './hooks/useCookie';
import { useDispatch, useSelector } from 'react-redux';
import { getUserThunk } from './slices/userSlice';
import { BrowserRouter, Route, Router, Routes, useNavigate } from 'react-router-dom';
import Login from './routes/Login';
import ErrorPage from './components/ErrorPage';
import Home from './routes/Home';
import Students from './routes/Students';
import Navbar from './components/Navbar';
import NewStudent from './routes/NewStudent';
import ViewStudent from './routes/ViewStudent';
import Fee from './routes/Fee';
import PayFee from './routes/PayFee';
import Classes from './routes/Classes';
import ViewClass from './routes/ViewClass';
import NewClass from './routes/NewClass';
import Teachers from './routes/Teachers';
import AddTeacher from './routes/AddTeacher';
import ViewTeacher from './routes/ViewTeacher';
import ReplaceTeachers from './routes/ReplaceTeachers';
import BulkActions from './routes/BulkActions';
import BulkStudents from './routes/BulkStudents';
import BulkTeachers from './routes/BulkTeachers';
import BulkClasses from './routes/BulkClasses';
import TeacherPanel from './routes/TeacherPanel';


function App() {

  const state = useSelector(state=>state.user)
const dispatch = useDispatch();
const token = useToken();
const navigate = useNavigate();
const user = useSelector(state=>state.user)
useEffect(()=>{


if(token){
  dispatch(getUserThunk(token));
}
else{
navigate('/login',{replace:true})
}

},[])
  return (
    <>
      { user.user.role==="Admin"&&<Navbar></Navbar>}
  <Routes >

    <Route path='/' element={user.user.role==="Admin"?<Home></Home>:<TeacherPanel></TeacherPanel>} errorElement={<ErrorPage />}></Route>
    <Route path='/login' element={<Login></Login>} errorElement={<ErrorPage />}/>
    <Route path='/students' element={<Students></Students>} errorElement={<ErrorPage />}/>
    <Route path='/student/new' element={<NewStudent></NewStudent>} errorElement={<ErrorPage />}/>
    <Route path='/student/:sid' element={<ViewStudent></ViewStudent>} errorElement={<ErrorPage />}/>
    <Route path='/fee' element={<Fee></Fee>} errorElement={<ErrorPage></ErrorPage>}></Route>
    <Route path='/class' element={<Classes></Classes>} errorElement={<ErrorPage></ErrorPage>}></Route>
    <Route path='/class/:cid' element={<ViewClass></ViewClass>} errorElement={<ErrorPage></ErrorPage>}></Route>
    <Route path='/new-class' element={<NewClass></NewClass>} errorElement={<ErrorPage></ErrorPage>}></Route>
    <Route path='/teacher' element={<Teachers></Teachers>} errorElement={<ErrorPage></ErrorPage>}></Route>
    <Route path='/teacher/replace' element={<ReplaceTeachers></ReplaceTeachers>} errorElement={<ErrorPage></ErrorPage>}></Route>
    <Route path='/teacher/add' element={<AddTeacher></AddTeacher>} errorElement={<ErrorPage></ErrorPage>}></Route>
    <Route path='/teacher/view/:tid' element={<ViewTeacher></ViewTeacher>} errorElement={<ErrorPage></ErrorPage>}></Route>
   
      <Route path='/bulk/student' element={<BulkStudents></BulkStudents>}></Route>
      <Route path='/bulk/class' element={<BulkClasses></BulkClasses>}></Route>
      <Route path='/bulk/teacher' element={<BulkTeachers></BulkTeachers>}></Route>
   
    </Routes>
    </>
 
  
  )
}

export default App
