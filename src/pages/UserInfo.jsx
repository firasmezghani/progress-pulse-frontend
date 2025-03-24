import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LogOut, Trash2, LayoutDashboard } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserInfo() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setFormData({ name: res.data.name, email: res.data.email });
    } catch (err) {
      toast.error("Failed to load user info");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put("http://localhost:5001/api/auth/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:5001/api/auth/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      navigate("/");
      toast.success("Account deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <p className="p-4">Loading user info...</p>;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg hidden md:block">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Progress Pulse
          </h1>
        </div>
        <nav className="flex flex-col gap-4 p-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col p-6">
        <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4 text-center">User Profile</h2>

          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded text-black"
            />
          </div>

          <div className="flex justify-between gap-3">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Trash2 size={16} /> Delete Account
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 w-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-black dark:text-white px-4 py-2 rounded flex justify-center gap-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}

export default UserInfo;
