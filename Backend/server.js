
const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST || "database",
    user: process.env.DB_USER || "saiuser",
    password: process.env.DB_PASSWORD || "SaiDbPass123!",
    database: process.env.DB_NAME || "saipackers"
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "healthy",
        application: "Sai Packers Backend"
    });
});

// Submit customer quote
app.post("/api/quotes", async (req, res) => {
    try {
        const {
            customerName,
            phone,
            pickup,
            destination,
            shiftingDate
        } = req.body;

        if (!customerName || !phone || !pickup || !destination) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        const sql = `
            INSERT INTO quotes
            (customer_name, phone, pickup, destination, shifting_date)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(sql, [
            customerName,
            phone,
            pickup,
            destination,
            shiftingDate || null
        ]);

        res.status(201).json({
            message: "Thank you for choosing Sai Packers & Movers! Your quote request has been received successfully. Our team will contact you shortly.",
            quoteId: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to submit quote"
        });
    }
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Sai Packers Backend running on port 3000");
});
