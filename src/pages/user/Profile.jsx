import React, { useState } from "react";
import axios from "axios";
import image from "../../assets/profile.jpeg";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const today = new Date();
  const options = { weekday: "long", day: "2-digit", month: "long", year: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options);

  const fields = [
    { label: "Full Name", key: "name", placeholder: "Your First Name" },
    { label: "Mobile", key: "mobile", placeholder: "Your Mobile Number" },
    { label: "Date of Birth", key: "dob", placeholder: "Your DOB" },
    { label: "Department", key: "department", placeholder: "Your Department" },
  ];

  const [editableFields, setEditableFields] = useState({});
  const [formData, setFormData] = useState({ ...user });
  const [isProfileEditing, setIsProfileEditing] = useState(false);

  const handleEditClick = (key) => {
    setEditableFields({ ...editableFields, [key]: !editableFields[key] });
  };

  const handleChange = (e, key) => {
    let value = e.target.value;
    if (key === "mobile") {
      value = value.replace(/\D/g, "");
      if (value.length > 10) return;
    }
    setFormData({ ...formData, [key]: value });
  };

  const handleSave = async (key) => {
    const updatedField = { [key]: formData[key] };

    try {
      const response = await axios.patch(`https://foodhubapi-1.onrender.com/api/user/${user.id}/profile`, updatedField);
      if (response.status === 200) {
        const updatedUser = { ...user, ...updatedField };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setEditableFields({ ...editableFields, [key]: false });
      }
    } catch (error) {
      console.error("Error updating user field:", error);
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-r from-gray-100 to-orange-100">
      {/* Profile Heading */}
      <h1 className="text-4xl font-bold text-black mb-6 relative">
        Profile
        <span className="block w-20 h-1 bg-orange-500 mt-1 mx-auto"></span>
      </h1>

      <div className="w-full max-w-4xl bg-white shadow-lg border border-gray-300 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-black">Welcome, {user.name}</h2>
        <p className="text-gray-600">{formattedDate}</p>

        {/* Profile Section */}
        <div className="mt-6 flex items-center space-x-6 relative">
          <div className="relative">
            <img className="w-28 h-28 rounded-full border-4 border-gray-400" src={image} alt="Profile" />
            <button
              className="absolute -top-2 -right-2 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 shadow-md"
              onClick={() => setIsProfileEditing(!isProfileEditing)}
            >
              <i className="fa-solid fa-pencil"></i>
            </button>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-black">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field, index) => (
            <div key={index} className="relative">
              <label className="text-gray-700 font-medium">{field.label}</label>
              <div className="relative mt-1">
                <input
                  type={field.key === "dob" && editableFields[field.key] ? "date" : "text"}
                  value={
                    field.key === "dob" && formData.dob
                      ? editableFields[field.key]
                        ? new Date(formData.dob).toISOString().split("T")[0]
                        : new Date(formData.dob).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                      : formData[field.key] || ""
                  }
                  placeholder={field.placeholder}
                  className={`w-full p-2 pr-12 rounded-lg border transition-all duration-300 ${
                    editableFields[field.key]
                      ? "border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                      : "border-gray-400 bg-gray-100"
                  }`}
                  disabled={!editableFields[field.key]}
                  onChange={(e) => handleChange(e, field.key)}
                />
                <button
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-lg transition-all duration-300 text-white ${
                    editableFields[field.key] ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                  }`}
                  onClick={() =>
                    editableFields[field.key] ? handleSave(field.key) : handleEditClick(field.key)
                  }
                >
                  {editableFields[field.key] ? (
                    <i className="fa-solid fa-floppy-disk"></i>
                  ) : (
                    <i className="fa-solid fa-pencil"></i>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
