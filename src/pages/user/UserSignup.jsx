import React, { useState } from "react";
import axios from "axios";
import backgroundImage from "../../assets/background.png";
import Loader from "../../Loader";
import { useNavigate } from "react-router-dom";

const UserSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    department: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading,setLoading] =useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("https://foodhubapi-1.onrender.com/api/user/signup", formData);
      alert(response.data.message);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed! Please try again.");
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen px-4">
  {loading && (
    <div className="absolute inset-0 flex justify-center items-center  backdrop-blur-sm z-50">
      <Loader />
    </div>
  )}

      {/* Background with Blur Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: "blur(4px)",
          zIndex: "-1",
        }}
      ></div>

      {/* Signup Form */}
      <div className={`${loading ? "blur-xs" : ""} relative z-10 w-[400px] bg-white bg-opacity-90 p-8 rounded-2xl shadow-2xl border border-gray-200`}>
        <h2 className="text-3xl font-bold text-orange-500 text-left mb-5">User Signup</h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Date of Birth", name: "dob", type: "date" },
            { label: "Department", name: "department", type: "text" },
            { label: "Mobile", name: "mobile", type: "text" },
            { label: "Password", name: "password", type: "password" },
            { label: "Confirm Password", name: "confirmPassword", type: "password" },
          ].map(({ label, name, type }) => (
            <div className="mb-2" key={name}>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={label}
                required
                className="w-full p-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition placeholder:font-medium"
              />
            </div>
          ))}

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSignup;
