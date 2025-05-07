import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import defaultRestaurant from "../../assets/defaultRestaurant.jpg";
const baseURL = import.meta.env.VITE_API_BASE_URL;

function Settings() {
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [user, setUser] = useState({});
  const [editableFields, setEditableFields] = useState({});
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user")) || {};
        setUser(storedUser);
        setFormData(storedUser);

        const res = await axios.get(`${baseURL}/admin/${id}/settings`);
        setUser(res.data);
        setFormData(res.data);
        setImage(res.data.imageUrl || defaultRestaurant);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    await handleImageUpload(file);
  };

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `${baseURL}/admin/${id}/settings`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setImage(`${res.data.imageUrl}?v=${Math.random()}`);
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (key) => {
    setEditableFields({ ...editableFields, [key]: !editableFields[key] });
  };

  const handleChange = (e, key) => {
    setFormData({ ...formData, [key]: e.target.value });
  };

  const handleSave = async (key) => {
    const updatedField = { [key]: formData[key] };

    try {
      await axios.patch(`${baseURL}/admin/${id}/settings`, updatedField);
      setUser({ ...user, ...updatedField });
      localStorage.setItem("user", JSON.stringify({ ...user, ...updatedField }));
      setEditableFields({ ...editableFields, [key]: false });
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-r from-gray-100 to-orange-100">
      <h1 className="text-4xl font-bold text-black mb-6 relative">Settings</h1>
      <div className="w-full max-w-4xl bg-white shadow-lg border border-gray-300 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-black">Manage Your Settings</h2>
        <div className="mt-6 flex justify-center">
  <div className="relative">
    <img
      className="w-28 h-28 rounded-full border-4 border-gray-400 object-cover"
      src={preview || image}
      alt="Profile"
    />
    <button
      className="absolute -top-2 -right-2 bg-orange-500 text-white p-2 rounded-full"
      onClick={handleProfileClick}
    >
      <i className="fa-solid fa-pencil"></i>
    </button>
    <input
      type="file"
      accept=".png, .jpg, .jpeg"
      ref={fileInputRef}
      onChange={handleFileSelect}
      className="hidden"
    />
  </div>
</div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {["name", "restaurantName", "email", "mobile", "dob"].map((key, index) => (
            <div key={index} className="relative">
              <label className="text-gray-700 font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</label>
              <div className="relative mt-1">
                <input
                  type={key === "dob" && editableFields[key] ? "date" : "text"}
                  value={
                    key === "dob" && formData[key]
                      ? new Date(formData[key]).toISOString().split("T")[0] // Ensures proper date format (YYYY-MM-DD)
                      : formData[key] || ""
                  }
                  className={`w-full p-2 pr-12 rounded-lg border transition-all duration-300 ${
                    editableFields[key] ? "border-orange-500" : "border-gray-400 bg-gray-100"
                  }`}
                  disabled={!editableFields[key]}
                  onChange={(e) => handleChange(e, key)}
                />
                <button
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-lg text-white ${
                    editableFields[key] ? "bg-green-500" : "bg-red-500"
                  }`}
                  onClick={() => (editableFields[key] ? handleSave(key) : handleEditClick(key))}
                >
                  <i className={`fa-solid ${editableFields[key] ? "fa-floppy-disk" : "fa-pencil"}`}></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Settings;
