import { useState } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);

  const sendQuery = async () => {
    setMessages([...messages, { role: "user", text: query }]);
    setQuery("");

    try {
      const res = await axios.post("http://localhost:5000/api/gemini", { query });
      const reply = res.data.result;

      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cross-Chain AI Wallet Copilot</h1>
      <div className="border rounded p-4 h-80 overflow-y-scroll mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-blue-600" : "text-green-600"}>
            <b>{msg.role}:</b> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow border rounded px-3 py-2"
          placeholder="Type: Check my ETH balance"
        />
        <button onClick={sendQuery} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
