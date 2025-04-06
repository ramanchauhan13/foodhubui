import React, { useState } from "react";
import axios from "axios";
import backgroundImage from "../../assets/background.png"; // Background image path
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role is "user"
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth", {
        email,
        password,
        role,
      });
  
      if (response.status === 200) {
        const { token, name, id, email, mobile, dob, department } = response.data;
        toast.success("Login Successfully");

        // Save user details in localStorage
        localStorage.setItem("user", JSON.stringify({ name, token, id, role, email, mobile, dob, department }));

        // Redirect after 1 second
        setTimeout(() => {
          navigate(role === "admin" ? `/admin/${id}/dashboard` : `/user/${id}/home`);
        }, 1000);
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login error. Please try again.");
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen px-4">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: "blur(2px)",
          zIndex: "-1",
        }}
      ></div>

      {/* Login Form */}
      <div className="relative z-10 w-[380px] bg-white bg-opacity-90 p-8 rounded-2xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-orange-500 text-left mb-6">Login</h2>

        {/* Role Toggle Switch */}
        <div
          className="relative w-full h-12 border border-gray-400 bg-gray-300 rounded-full flex items-center mb-6 cursor-pointer p-1 transition-all duration-300"
          onClick={() => setRole(role === "user" ? "admin" : "user")}
        >
          {/* Sliding Background */}
          <div
            className={`absolute top-0.5 left-1 w-[49%] h-[90%] rounded-full transition-all duration-300 ease-in-out ${
              role === "admin" ? "translate-x-[100%] bg-orange-500" : "bg-orange-400"
            }`}
          ></div>

          {/* User Role */}
          <span
            className={`w-1/2 text-center font-semibold relative z-10 transition-all ${
              role === "user" ? "text-white" : "text-gray-700"
            }`}
          >
            User
          </span>

          {/* Admin Role */}
          <span
            className={`w-1/2 text-center font-semibold relative z-10 transition-all ${
              role === "admin" ? "text-white" : "text-gray-700"
            }`}
          >
            Admin
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
            className="w-full p-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition placeholder:font-medium"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            required
            className="w-full p-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition placeholder:font-medium"
          />

          <button
            type="submit"
            onClick={handleLogin}
            className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Login
          </button>
        </form>
      </div>

      {/* Toast Notification */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default Login;
