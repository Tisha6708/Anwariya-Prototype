import { useState } from "react";
import { useParams } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";
import InfluencerProfileModal from "../../components/vendor/InfluencerProfileModal";

export default function VendorChat() {
  const { id } = useParams();
  const [showProfile, setShowProfile] = useState(false);

  // dummy chat data (simulate backend)
  const chats = [
    {
      id: "1",
      influencer: "Ananya Sharma",
      product: "Skincare Serum",
    },
    {
      id: "2",
      influencer: "Rahul Verma",
      product: "Fitness Band",
    },
  ];

  const chat = chats.find((c) => c.id === id);

  if (!chat) {
    return (
      <PageWrapper title="Chat">
        <p className="text-gray-500">Chat not found</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Chat">
      {/* HEADER */}
      <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold">{chat.influencer}</h3>
          <p className="text-sm text-gray-500">
            {chat.product}
          </p>
        </div>

        <button
          onClick={() => setShowProfile(true)}
          className="text-purple-600 text-sm"
        >
          View Profile
        </button>
      </div>

      {/* CHAT AREA */}
      <div className="bg-white p-4 rounded-xl shadow h-80 mb-4">
        <p className="text-gray-500 text-sm">
          Messages with {chat.influencer} will appear here
        </p>
      </div>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          placeholder="Type a message..."
          className="border p-3 flex-1 rounded"
        />
        <button className="bg-purple-600 text-white px-5 rounded">
          Send
        </button>
      </div>

      {/* PROFILE MODAL */}
      {showProfile && (
        <InfluencerProfileModal
          influencerName={chat.influencer}
          onClose={() => setShowProfile(false)}
        />
      )}
    </PageWrapper>
  );
}
