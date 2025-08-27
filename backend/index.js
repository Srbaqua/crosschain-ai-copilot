// backend/index.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Gemini API Endpoint
app.post("/api/gemini", async (req, res) => {
  try {
    const { query } = req.body;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        contents: [{ role: "user", parts: [{ text: query }] }]
      }
    );

    const text =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";
    res.json({ result: text });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Gemini API error" });
  }
});

// Mock Gateway API
app.post("/api/balance", async (req, res) => {
  const { address } = req.body;
  res.json({
    address,
    balances: {
      ethereum: "0.54 ETH",
      polygon: "120 MATIC",
    },
  });
});

app.post("/api/transfer", async (req, res) => {
  const { fromChain, toChain, amount, token } = req.body;
  res.json({
    status: "success",
    txHash: "0x123fakehash",
    message: `Transferred ${amount} ${token} from ${fromChain} to ${toChain}`,
  });
});

app.get("/", (req, res) => {
  res.send("🚀 Cross-Chain AI Copilot Backend is running!");
});

app.listen(5000, () =>
  console.log("✅ Backend running on http://localhost:5000")
);
