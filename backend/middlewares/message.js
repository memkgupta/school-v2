const error = require('./error');

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const sendSingleMessage = (body,to)=>{
  return new Promise((resolve,reject)=> {
    client.messages
         .create({from: process.env.TWILLIO_NUMBER, body: body, to: to}).then(()=>{
         resolve({success:true,message:"Message Sent Successfully"})
         }).catch(
   (err)=>{
    reject(err.message)
     console.log(err)
   }
         )
       }
   )
}
const notify = async(body,numbers)=>{
  console.log(numbers.map(number=>[JSON.stringify({binding_type:"sms",address:number})]))
    const notificationOpts = {
        toBinding:numbers.map(number=>(JSON.stringify({binding_type:"sms",address:number}))),
        body:body
    }
    client.notify.v1
    .services(process.env.SERVICE_SID)
    .notifications.create(notificationOpts)
    .then(notification => console.log(notification.sid))
    .catch(error => console.log(error));
}    
      module.exports={sendSingleMessage,notify}