import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  LogOut,
  Moon,
  Sun,
  Plus,
  Settings,
  LayoutDashboard,
  X,
  Pencil,
} from "lucide-react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/logo1.png"; // 🖼️ Logo local

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [newHabit, setNewHabit] = useState({ title: "", frequency: "" });
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const applyTheme = (dark) => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    applyTheme(darkMode);
  }, [darkMode]);

  const fetchHabits = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/habits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits(res.data);
    } catch (err) {
      toast.error("Could not fetch habits.");
    }
  };

  const handleAddHabit = async () => {
    try {
      if (editingHabit) {
        await axios.put(
          `http://localhost:5001/api/habits/${editingHabit._id}`,
          newHabit,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Habit updated!");
      } else {
        await axios.post("http://localhost:5001/api/habits", newHabit, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Habit added!");
      }
      setNewHabit({ title: "", frequency: "" });
      setEditingHabit(null);
      setShowModal(false);
      fetchHabits();
    } catch (err) {
      toast.error("Could not save habit.");
    }
  };

  const handleEditHabit = (habit) => {
    setNewHabit({ title: habit.title, frequency: habit.frequency });
    setEditingHabit(habit);
    setShowModal(true);
  };

  const handleDeleteHabit = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/habits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchHabits();
      toast.success("Habit deleted.");
    } catch (err) {
      toast.error("Failed to delete habit.");
    }
  };

  const handleMarkDone = async (habitId) => {
    try {
      await axios.put(
        `http://localhost:5001/api/habits/${habitId}`,
        { doneToday: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Habit marked as done!");
      fetchHabits();
    } catch (err) {
      toast.error("Failed to mark habit as done.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Sidebar */}
        <aside
          className={`fixed md:static z-30 top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 md:translate-x-0`}
        >
          <div className="flex justify-between items-center p-6">
            <div
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img
                src={logo}
                alt="Logo"
                className="w-16 h-16 object-cover shadow-md" // ✅ Logo carré stylé
              />
              <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Progress Pulse
              </h1>
            </div>
            <button
              className="md:hidden text-gray-600 dark:text-gray-300"
              onClick={() => setSidebarOpen(false)}
            >
              <X />
            </button>
          </div>

          <nav className="flex flex-col gap-5 px-6 text-gray-700 dark:text-gray-300">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button
              onClick={() => navigate("/user")}
              className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Settings size={18} /> Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 mt-10 text-red-500 hover:text-red-600"
            >
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 bg-white dark:bg-gray-800 shadow px-4 py-4 flex justify-between items-center z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-gray-700 dark:text-gray-300"
              >
                <Menu />
              </button>
              <h2 className="text-xl font-semibold">My Habits</h2>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => {
                  setNewHabit({ title: "", frequency: "" });
                  setEditingHabit(null);
                  setShowModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Plus size={16} /> Add
              </button>
            </div>
          </header>

          <main className="p-6 overflow-y-auto flex-1">
            {habits.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-10 text-gray-600 dark:text-gray-400"
              >
                No habits yet. Click "Add" to get started!
              </motion.p>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {habits.map((habit) => (
                  <div
                    key={habit._id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition"
                  >
                    <h3 className="text-lg font-semibold">{habit.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {habit.frequency}
                    </p>
                    <div className="flex gap-3 mt-4 flex-wrap items-center">
                      {habit.doneToday ? (
                        <span className="text-green-500 font-semibold">
                          ✅ Done Today
                        </span>
                      ) : (
                        <button
                          onClick={() => handleMarkDone(habit._id)}
                          className="text-sm text-green-600 hover:underline"
                        >
                          Mark as Done
                        </button>
                      )}
                      <button
                        onClick={() => handleEditHabit(habit)}
                        className="text-sm text-yellow-500 hover:underline"
                      >
                        <Pencil size={14} className="inline mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteHabit(habit._id)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingHabit ? "Edit Habit" : "New Habit"}
            </h2>
            <input
              type="text"
              placeholder="Habit title"
              value={newHabit.title}
              onChange={(e) =>
                setNewHabit({ ...newHabit, title: e.target.value })
              }
              className="w-full px-4 py-2 border rounded mb-3 text-black"
            />
            <input
              type="text"
              placeholder="Frequency (e.g., Daily)"
              value={newHabit.frequency}
              onChange={(e) =>
                setNewHabit({ ...newHabit, frequency: e.target.value })
              }
              className="w-full px-4 py-2 border rounded mb-4 text-black"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHabit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editingHabit ? "Update" : "Add"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default Dashboard;
