import { NavLink } from "react-router-dom";

export default function InfluencerNavbar({ tokens }) {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <h1 className="font-bold text-blue-600">
        Influencer Panel
      </h1>

      <div className="flex gap-6 items-center text-sm">
        <NavLink
          to="/influencer"
          className={({ isActive }) =>
            isActive ? "font-semibold" : "text-gray-600"
          }
        >
          Campaigns
        </NavLink>

        <NavLink
          to="/influencer/chats"
          className={({ isActive }) =>
            isActive ? "font-semibold" : "text-gray-600"
          }
        >
          My Chats
        </NavLink>

        <NavLink
          to="/influencer/profile"
          className={({ isActive }) =>
            isActive ? "font-semibold" : "text-gray-600"
          }
        >
          Profile
        </NavLink>

        {/* TOKEN BADGE */}
        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
          {tokens} Tokens
        </div>

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="text-red-500 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
