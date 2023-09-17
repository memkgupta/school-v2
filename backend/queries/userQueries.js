const AUTH_QUERY = "SELECT * FROM users WHERE uid = $1";
const REGISTER_QUERY= "INSERT INTO users (uname,email,password,role,name) VALUES($1,$2,$3,$4,$5)";
const LOGIN_QUERY = "SELECT * FROM users WHERE uname = $1  AND password = $2";
module.exports={AUTH_QUERY,REGISTER_QUERY,LOGIN_QUERY};