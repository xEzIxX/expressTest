import 'dotenv/config' 
import express from 'express';


const app = express();

app.get('/',(req,res)=>{
    res.send("hello, node..");
})

app.listen(process.env.SECRET_PORT, ()=>{
    console.log('server is running~')
})