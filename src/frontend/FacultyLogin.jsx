import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer.jsx";

function FacultyLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/facultylogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (result.success) {
      alert("Login successful!");
      navigate("/facultydb");
      // You can navigate to a different component or page here
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-gray-100"
      accordion
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">FACULTY LOGIN</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <Footer />
      </div>
    </div>
  );
}

export default FacultyLogin;
