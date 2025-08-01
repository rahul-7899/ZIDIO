import React, { useState, useRef, useEffect } from "react";
import API from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { setChartData, setHistory } from "../redux/chartSlice";
import Chart from "chart.js/auto";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

const chartTypes = [
  { label: "Bar", value: "bar" },
  { label: "Line", value: "line" },
  { label: "Pie", value: "pie" },
  { label: "Scatter", value: "scatter" },
  { label: "3D Column", value: "3dcolumn" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, history } = useSelector((s) => s.chart);
  const { user } = useSelector((s) => s.auth);

  const [file, setFile] = useState(null);
  const [table, setTable] = useState([]);
  const [fields, setFields] = useState([]);
  const [selectedX, setSelectedX] = useState("");
  const [selectedY, setSelectedY] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const threeRef = useRef();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/charts/my");
      dispatch(setHistory(res.data));
    } catch { }
  };

  const handleFile = async (e) => {
    setError("");
    setTable([]);
    setFields([]);
    setSelectedX("");
    setSelectedY("");
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);

    const form = new FormData();
    form.append("file", f);
    try {
      const res = await API.post("/files/upload", form);
      setTable(res.data.data);
      if (res.data.data.length > 0) {
        setFields(Object.keys(res.data.data[0]));
      }
    } catch (err) {
      setError(err.response?.data?.error || "Upload error");
    }
  };

  const handleRenderChart = () => {
    if (chartType !== "3dcolumn" && (!selectedX || !selectedY)) {
      setError("Select X and Y fields");
      return;
    }
    if (chartType === "3dcolumn") {
      render3DChart();
      dispatch(setChartData([]));
      return;
    }
    // Prepare chart.js data
    const labels = table.map((row) => row[selectedX]);
    const dataset = table.map((row) => Number(row[selectedY]) || 0);
    const dataObj = {
      labels,
      datasets: [
        { label: title || selectedY, data: dataset, backgroundColor: "rgba(59,130,246,0.5)" }
      ]
    };
    dispatch(setChartData(dataObj));
    setError("");
  };

  const render3DChart = () => {
    if (!threeRef.current) return;
    // Basic 3D Bar Chart using Three.js
    threeRef.current.innerHTML = "";
    const width = 400, height = 300;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    threeRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(0.5, 1, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
    for (let i = 0; i < table.length; i++) {
      const y = fields[1] ? (Number(table[i][fields[1]]) || 1) / 10 : 1;
      const bar = new THREE.Mesh(geometry.clone().scale(1, y, 1), material.clone());
      bar.position.x = i - table.length / 2;
      bar.position.y = y / 2;
      scene.add(bar);
    }
    camera.position.z = 10;
    renderer.render(scene, camera);
  };

  const handleSaveChart = async () => {
    if (!chartType || !title) return setError("Enter chart title");
    try {
      await API.post("/charts/save", {
        chartType,
        title,
        fields: [selectedX, selectedY],
        data,
      });
      fetchHistory();
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Save error");
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <header className="flex justify-between mb-4 items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          {user?.role === "admin" && (
            <button className="mr-2 px-3 py-1 bg-gray-800 text-white rounded" onClick={() => navigate("/admin")}>
              Admin Panel
            </button>
          )}
          <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => { dispatch(logout()); navigate("/login"); }}>
            Logout
          </button>
        </div>
      </header>
      <div className="bg-white p-4 rounded shadow mb-4">
        <input type="file" accept=".xlsx,.xls" onChange={handleFile} />
        {fields.length > 0 && (
          <div className="flex flex-wrap mt-3 items-center gap-2">
            <select className="border p-1 rounded" value={chartType} onChange={e => setChartType(e.target.value)}>
              {chartTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            {chartType !== "3dcolumn" && (
              <>
                <select className="border p-1 rounded" value={selectedX} onChange={e => setSelectedX(e.target.value)}>
                  <option value="">X</option>
                  {fields.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <select className="border p-1 rounded" value={selectedY} onChange={e => setSelectedY(e.target.value)}>
                  <option value="">Y</option>
                  {fields.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </>
            )}
            <input
              className="border p-1 rounded"
              placeholder="Chart Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleRenderChart}>
              Render Chart
            </button>
            <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleSaveChart}>
              Save Chart
            </button>
          </div>
        )}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </div>
      {table.length > 0 && (
        <div className="mb-4 overflow-auto">
          <table className="min-w-full border">
            <thead>
              <tr>
                {fields.map((f) => <th key={f} className="border px-2 py-1">{f}</th>)}
              </tr>
            </thead>
            <tbody>
              {table.slice(0, 10).map((row, idx) => (
                <tr key={idx}>
                  {fields.map(f => <td key={f} className="border px-2 py-1">{row[f]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-xs text-gray-500">Showing first 10 rows</div>
        </div>
      )}
      <div className="bg-white p-4 rounded shadow mb-4">
        {chartType === "bar" && data.labels && <Bar data={data} />}
        {chartType === "line" && data.labels && <Line data={data} />}
        {chartType === "pie" && data.labels && <Pie data={data} />}
        {chartType === "scatter" && data.labels && <Scatter data={data} />}
        {chartType === "3dcolumn" && (
          <div ref={threeRef} className="w-full h-72" />
        )}
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Chart History</h2>
        <ul>
          {history.map((h) => (
            <li key={h._id} className="border-b py-2">
              <span className="font-bold">{h.title}</span> ({h.chartType}) - {new Date(h.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}