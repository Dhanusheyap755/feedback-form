
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Allow frontend connections
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/feedbackDB")
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log("MongoDB Error:", err.message);
    });

// Feedback model
const Feedback = mongoose.model("Feedback", {
    name: String,
    department: String,
    session: String,
    feedback: String,
    suggestions: String
});

// Test backend
app.get("/", (req, res) => {
    res.send("Backend is working!");
});

// Submit feedback
app.post("/feedback", async (req, res) => {
    try {
        const savedFeedback = await Feedback.create(req.body);

        res.status(201).json({
            message: "Feedback submitted successfully!",
            data: savedFeedback
        });
    } catch (error) {
        console.log("Error:", error.message);

        res.status(500).json({
            message: "Failed to save feedback"
        });
    }
});

// View feedback
app.get("/feedback", async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve feedback"
        });
    }
});

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});

