import { NavLink } from "react-router-dom";

export default function VendorNavbar() {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <h1 className="font-bold text-purple-600">Vendor Panel</h1>

      <div className="flex gap-6 text-sm items-center">
        <NavLink to="/vendor/home">Home</NavLink>
        <NavLink to="/vendor/create">Create Post</NavLink>
        <NavLink to="/vendor/chats">Chats</NavLink>
        <NavLink to="/vendor/dashboard">Dashboard</NavLink>
        <NavLink to="/vendor/products">Products</NavLink>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="text-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
