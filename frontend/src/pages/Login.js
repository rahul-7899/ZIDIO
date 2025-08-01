import React, { useState } from "react";
import API from "../utils/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const url = isRegister ? "/users/register" : "/users/login";
      const res = await API.post(url, { username, password });
      if (isRegister) {
        setIsRegister(false);
        setError("Registered. Please login.");
      } else {
        dispatch(loginSuccess(res.data));
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded shadow-md w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl mb-6 font-bold text-center">
          {isRegister ? "Register" : "Login"}
        </h2>
        {error && <div className="mb-2 text-red-500">{error}</div>}
        <input
          className="w-full p-2 mb-4 border rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full p-2 mb-4 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          type="submit"
        >
          {isRegister ? "Register" : "Login"}
        </button>
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-blue-600 underline"
            onClick={() => setIsRegister((v) => !v)}
          >
            {isRegister ? "Already have an account? Login" : "No account? Register"}
          </button>
        </div>
      </form>
    </div>
  );
}