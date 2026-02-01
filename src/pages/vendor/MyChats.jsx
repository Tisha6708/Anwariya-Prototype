import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";

export default function VendorMyChats() {
  const navigate = useNavigate();

  // dummy chats
  const chats = [
    {
      id: 1,
      influencer: "Ananya Sharma",
      product: "Skincare Serum",
      status: "Active",
    },
    {
      id: 2,
      influencer: "Rahul Verma",
      product: "Fitness Band",
      status: "Closed",
    },
  ];

  return (
    <PageWrapper
      title="My Chats"
      subtitle="Influencers who contacted you"
    >
      {chats.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <p className="text-gray-500">
            No conversations yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">
                  {chat.influencer}
                </h3>
                <p className="text-sm text-gray-500">
                  Product: {chat.product}
                </p>
                <span className="text-xs">
                  Status: {chat.status}
                </span>
              </div>

              <button
                onClick={() =>
                  navigate(`/vendor/chat/${chat.id}`)
                }
                className="text-purple-600 text-sm"
              >
                Open Chat →
              </button>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
