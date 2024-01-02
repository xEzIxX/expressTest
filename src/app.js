import 'dotenv/config' 
import express from 'express';
import morgan from 'morgan';

import loginRouter from './routers/login.js';

const app = express();

app.use(morgan('dev')); 

app.use('/login', loginRouter);

app.use((err,req,res,next)=>{
    res.status(404).send('Not Found');  
});

app.listen(process.env.SECRET_PORT, ()=>{
    console.log('server is running~')
})