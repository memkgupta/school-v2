import axios from "axios";
import { useEffect, useState } from "react";
import { useToken } from "../../hooks/useCookie";
import { BASE_URL } from "../../constants/global";

const AttendanceInterface = ({teacher}) => {
    const [students, setStudents] = useState([]);
  console.log(students)
    const toggleAttendance = (id) => {
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === id
            ? { ...student, present: !student.present }
            : student
        )
      );
    };
  useEffect(()=>{
    axios.get(`${BASE_URL}/student/all?class_id=${teacher.class_id}`,{headers:{'Authorization':`Bearer ${useToken()}`}}).then((res)=>{
        const data = res.data;
        
        setStudents(data.students);
    }
    )
  },[])
    return (
      <div className="bg-white p-4">
        <h1 className="text-2xl font-semibold mb-4">Attendance Interface</h1>
        {students.map((student) => (
          <div key={student.student_id} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`student-${student.student_id}`}
              className="mr-2"
              checked={student.present}
              onChange={() => toggleAttendance(student.student_id)}
            />
            <label htmlFor={`student-${student.student_id}`}>{student.first_name}</label>
          </div>
        ))}
      </div>
    );
  };
  
  export default AttendanceInterface;