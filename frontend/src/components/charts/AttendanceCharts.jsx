import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BASE_URL } from '../../constants/global';
import toast from 'react-hot-toast';
import { useToken } from '../../hooks/useCookie';
import { useParams } from 'react-router-dom';

function AttendanceCharts() {
    const [data,setData] = useState([]);

const {cid} = useParams();
    useEffect(()=>{
        axios.get(`${BASE_URL}/class/attendance/${cid}`,{headers:{'Authorization':`Bearer ${useToken()}`}})
        .then((res)=>{
            const data = res.data;
            console.log(data)
            setData(data.attendance);
        }).catch((err)=>{
            console.log(err.message)
            toast.error("Some Error Occured")
        })
    },[]);
  return (
    <div style={{width:'100%',height:'500px'}}>
            <ResponsiveContainer width="100%" height="100%">
    <AreaChart
      width={500}
      height={400}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="present" stroke="#8884d8" fill="#8884d8" />
    </AreaChart>
  </ResponsiveContainer>
    </div>


  )
}

export default AttendanceCharts