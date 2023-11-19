import 'dotenv/config' 
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express=session';
import dotenv


const app = express();

app.get('/',(req,res)=>{
    res.send("hello, node..");
})

app.listen(process.env.SECRET_PORT, ()=>{
    console.log('server is running~')
})