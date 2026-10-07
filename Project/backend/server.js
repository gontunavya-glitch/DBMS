const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
const authRoutes = require("./routes/authRoutes");
const donorRoutes = require("./routes/donorRoutes");
const bloodRoutes = require("./routes/bloodRoutes");
const requestRoutes = require("./routes/requestRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/blood", bloodRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/hospitals", hospitalRoutes);


// Test route
app.get("/", (req, res) => {
    res.send("Blood Bank Backend is Running");
});


// Start server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});