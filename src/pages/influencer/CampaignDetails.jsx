import { useNavigate, useParams } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";

export default function CampaignDetails({ tokens, setTokens }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const email = localStorage.getItem("email"); // assume saved at login
  const chatKey = `chats_${email}`;

  const chats = JSON.parse(localStorage.getItem(chatKey)) || [];

  const existingChat = chats.find(
    (c) => c.campaignId === id
  );

  const handleContact = () => {
    // ✅ If chat already exists → go directly
    if (existingChat) {
      navigate(`/influencer/chat/${existingChat.chatId}`);
      return;
    }

    // ❌ Not enough tokens
    if (tokens < 50) {
      navigate("/influencer/no-tokens");
      return;
    }

    // ✅ Deduct tokens ONCE
    setTokens(tokens - 50);

    const newChat = {
      chatId: Date.now().toString(),
      campaignId: id,
      vendorName: "GlowCare Pvt Ltd",
      product: "Skincare Serum",
    };

    localStorage.setItem(
      chatKey,
      JSON.stringify([...chats, newChat])
    );

    navigate(`/influencer/chat/${newChat.chatId}`);
  };

  return (
    <PageWrapper title="Campaign Details">
      <div className="bg-white p-6 rounded-xl shadow max-w-2xl">
        <h2 className="text-xl font-bold mb-2">
          Skincare Serum
        </h2>

        <p className="text-gray-600 mb-4">
          Looking for beauty influencers.
        </p>

        <button
          onClick={handleContact}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          {existingChat
            ? "Open Chat"
            : "Contact Vendor (50 tokens)"}
        </button>
      </div>
    </PageWrapper>
  );
}
