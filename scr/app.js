import 'dotenv/config' 
import express from 'express';

const app = express();

app.get('/',(req,res)=>{
    res.send("접속된 아이피 : "+req.ip);
})

app.listen(process.env.SECRET_PORT, ()=>{
    console.log('server is running~')
})