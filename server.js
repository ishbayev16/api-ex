const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');


//Load env vars
dotenv.config({path:'./config/config.env'});

//connect db
connectDB();

//Route files
const bootcamps = require('./routes/bootcamps');


const app = express();

//reques Body parser
app.use(express.json());


//middleware example
app.use(logger);

//dev logging middlewre
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//mount routers
app.use('/api/v1/bootcamps', bootcamps);


app.use(errorHandler);

// app.get('/',(req, res)=>{
//     /* res.sendStatus(400); */
//     /* res.status(400).json({succes: false}); */
//     res.status(200).json({succes: true, data: {id: 1}});
//     /* res.send('hello');
//     res.json({name: "BRad"}); */
// });





const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`App listening in ${process.env.NODE_ENV} mode on port ${PORT}`);
});


//handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //close server & exit process
    server.close(()=>process.exit(1));

})