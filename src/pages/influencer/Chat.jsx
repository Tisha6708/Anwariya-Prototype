import { useState } from "react";
import { useParams } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";

export default function InfluencerChat({ tokens, setTokens }) {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (messages.length >= 3) {
      if (tokens < 5) return alert("Not enough tokens");
      setTokens(tokens - 5);
    }

    setMessages([...messages, input]);
    setInput("");
  };

  return (
    <PageWrapper title="Chat with Vendor">
      <div className="bg-white p-4 rounded-xl shadow h-72 mb-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Start the conversation
          </p>
        ) : (
          messages.map((msg, i) => (
            <p key={i} className="mb-2">
              {msg}
            </p>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          className="border p-3 flex-1 rounded"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-5 rounded"
        >
          Send
        </button>
      </div>
    </PageWrapper>
  );
}
