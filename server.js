import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { safetySettings, generationConfig } from "./settings.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MODEL_NAME = process.env.MODEL_NAME;
const API_KEY = process.env.API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// Enable CORS for all routes
app.use(cors());

// Convert all requests to JSON
app.use(express.json());

// Define a basic route
app.get("/", (req, res) => {
  res.json({ message: "The backend is working!" });
});

app.post("/geminiapi", async (req, res) => {
  const text = req.body.text;
  const parts = [{ text }];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  res.json({ response: response.text() });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
