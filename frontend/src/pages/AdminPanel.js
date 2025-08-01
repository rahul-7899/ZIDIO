import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [charts, setCharts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchCharts();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch {}
  };

  const fetchCharts = async () => {
    try {
      const res = await API.get("/admin/charts");
      setCharts(res.data);
    } catch {}
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>
      </header>
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Users</h2>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Username</th>
              <th className="border px-2 py-1">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td className="border px-2 py-1">{u.username}</td>
                <td className="border px-2 py-1">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">All Charts</h2>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Title</th>
              <th className="border px-2 py-1">Type</th>
              <th className="border px-2 py-1">User</th>
              <th className="border px-2 py-1">Date</th>
            </tr>
          </thead>
          <tbody>
            {charts.map(c => (
              <tr key={c._id}>
                <td className="border px-2 py-1">{c.title}</td>
                <td className="border px-2 py-1">{c.chartType}</td>
                <td className="border px-2 py-1">{c.user?.username || "?"}</td>
                <td className="border px-2 py-1">{new Date(c.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}