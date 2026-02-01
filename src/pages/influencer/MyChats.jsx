import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";

export default function MyChats() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const chats =
    JSON.parse(localStorage.getItem(`chats_${email}`)) || [];

  return (
    <PageWrapper
      title="My Chats"
      subtitle="Your active collaborations"
    >
      {chats.length === 0 ? (
        <p className="text-gray-500">
          You haven’t contacted any vendors yet.
        </p>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {chats.map((chat) => (
            <div
              key={chat.chatId}
              className="bg-white p-5 rounded-xl shadow flex justify-between"
            >
              <div>
                <h3 className="font-semibold">
                  {chat.vendorName}
                </h3>
                <p className="text-sm text-gray-500">
                  {chat.product}
                </p>
              </div>

              <button
                onClick={() =>
                  navigate(
                    `/influencer/chat/${chat.chatId}`
                  )
                }
                className="text-blue-600 text-sm"
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
