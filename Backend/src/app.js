const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

const app = express();

const routes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");


// Security Middleware
app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: "cross-origin",
        },
    })
);


// CORS Configuration
<<<<<<< HEAD
const corsOptions = {
=======
app.use(cors({
>>>>>>> 252378e (Fix express cors options wildcard issue)
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
    ],
    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ],
<<<<<<< HEAD
};
=======
}));
>>>>>>> 252378e (Fix express cors options wildcard issue)


app.use(cors(corsOptions));


// Handle Preflight Requests
app.options("*", cors(corsOptions));


// Body Parser
app.use(express.json());


// Static Files
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "../uploads")
    )
);


// API Routes
app.use(routes);


// Error Handler (Always Last)
app.use(errorMiddleware);


// Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "School ERP API is Running"
    });
});


module.exports = app;
