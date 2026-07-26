const express = require('express');
const helmet = require("helmet");

const app = express();
const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');
const path = require('path');
const cors = require("cors");



app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: "cross-origin",
        },
    })
);


app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true,
}));


app.use(express.json());


// STATIC FILES FIRST
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "../uploads")
    )
);


// API ROUTES
app.use(routes);


// ERROR HANDLER LAST
app.use(errorMiddleware);



app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"school Erp Api is Running"
    });
});


module.exports = app;