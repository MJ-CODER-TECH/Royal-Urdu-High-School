const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

// Production (Render + TiDB Cloud)
if (isProduction) {
    dbConfig.ssl = {
        ca: fs.readFileSync(
            path.join(__dirname, "../certs/isrgrootx1.pem")
        ),
    };
}

const pool = mysql.createPool(dbConfig);

module.exports = pool;