const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const fileupload = require('express-fileupload');
const path = require('path');

//Load env vars
dotenv.config({path:'./config/config.env'});

//connect db
connectDB();

//Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');




const app = express();

//reques Body parser
app.use(express.json());

//Cookie-parser
app.use(cookieParser());

//middleware example
app.use(logger);

//dev logging middlewre
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//File uploading
app.use(fileupload());

//Sanitize data
app.use(mongoSanitize());

//set security headers
app.use(helmet());


//prevent xss attacks
app.use(xss());

//rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60* 1000, // 10 mins
    max:100
});

app.use(limiter);

//prevent http param pollution
app.use(hpp());

//enable CORS
app.use(cors());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));


//mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);




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