const ADD_TEACHER = "INSERT INTO teachers (name,salary,email,address,phone,whatsapp_number,profile_pic) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *";
const REMOVE_TEACHER = "DELETE FROM teachers WHERE id = $1";
module.exports={ADD_TEACHER,REMOVE_TEACHER};