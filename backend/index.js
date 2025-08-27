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

    // === Step 1: Call Gemini API ===
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: query }],
          },
        ],
      }
    );

    const aiText =
      geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

    // === Step 2: Command Handling (Wallet Example) ===
    if (aiText.toLowerCase().includes("check_balance")) {
      try {
        const balanceRes = await axios.post("http://localhost:5000/api/balance", {
          address: "0xYourWalletHere", // 🔜 Replace with dynamic extraction from AI/user
        });

        return res.json({
          action: "check_balance",
          result: balanceRes.data.balances,
        });
      } catch (balanceErr) {
        console.error("Balance API Error:", balanceErr.message);
        return res.status(500).json({
          error: "Failed to fetch wallet balance",
          details: balanceErr.message,
        });
      }
    }

    // === Step 3: Default → AI Response ===
    return res.json({ action: "chat", result: aiText });

  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Gemini API request failed",
      details: err.response?.data || err.message,
    });
  }
});


// Mock Gateway API
app.post("/api/balance", async (req, res) => {
  const { address } = req.body;
  res.json({
    address,
    balances: {
      ethereum: "0.54 ETH",
      polygon: "120 MATIC"
    }
  });
});

// Mock: simulate transfer
app.post("/api/transfer", async (req, res) => {
  const { fromChain, toChain, amount, token } = req.body;
  res.json({
    status: "success",
    txHash: "0x123fakehash",
    message: `Transferred ${amount} ${token} from ${fromChain} to ${toChain}`
  });
});
app.get("/", (req, res) => {
  res.send("🚀 Cross-Chain AI Copilot Backend is running!");
});

app.listen(5000, () =>
  console.log("✅ Backend running on http://localhost:5000")
);
