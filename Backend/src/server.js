require("dotenv").config();

const app = require("./app");
const pool = require("./config/database");


const PORT = process.env.PORT || 5000;

async function startServer() {
    try {

        // Database connection test
        await pool.query("SELECT 1");

        console.log("✅ Database Connected Successfully");

        // Server start
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });

    } catch (error) {

        console.error("❌ Database Connection Failed");
        console.error(error.message);

        process.exit(1);
    }
}

startServer();