import React, { useState, useEffect } from "react";
import axios from "axios";

function Address() {
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const [address, setAddress] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    classNumber: "",
    building: "",
    floor: "",
    mobileNumber: "",
  });
  const [isEditable, setIsEditable] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Room Number Validation (Only 4 Digits)
    if (name === "classNumber" && !/^[0-9]{0,4}$/.test(value)) return;

    // Mobile Number Validation (Only 10 Digits)
    if (name === "mobileNumber" && !/^[0-9]{0,10}$/.test(value)) return;

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.mobileNumber.length !== 10) {
      setError("Mobile number must be exactly 10 digits");
      return;
    }
    if (form.classNumber.length < 4) {
      setError("Room number must be at least 4 digits long!");
      return;
    }
    console.log("Submitting form with userId:", userId); 

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/user/${userId}/address`,
        form
      );
      if (response.status === 200) {
        setAddress(form);
        setForm({ classNumber: "", building: "", floor: "", mobileNumber: "" });
        setIsEditable(false);
        alert("Address saved successfully!");
        setError(""); // Clear errors after successful submission
      }
    } catch (error) {
      console.error("Error saving address:", error);
      setError("Failed to save address. Please try again later.");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAddress();
    }
  }, [userId]);

  const fetchAddress = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/${userId}/address`);
      if (response.status === 200 && response.data.address) {
        setAddress(response.data.address);
        setIsEditable(false);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setError("Failed to fetch address. Please try again.");
    }
  };

  const handleEdit = () => {
    setForm(address);
    setAddress(null);
    setIsEditable(true);
  };

  const handleRemove = () => {
    setAddress(null);
    setIsEditable(true);
  };

  return (
    <div className="bg-gray-100 h-full px-6 py-4 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
        Manage Address
      </h1>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Address Form Section */}
        <div className="bg-white p-5 rounded-lg shadow-md md:col-span-2">
          <h3 className="text-xl font-semibold mb-3 text-gray-700">
            Add Address
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1 - Room Number & Floor */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-lg text-gray-600">Room Number:</label>
                <input
                  type="text"
                  name="classNumber"
                  value={form.classNumber}
                  onChange={handleChange}
                  disabled={!isEditable}
                  required
                  maxLength="4"
                  className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-200"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-lg text-gray-600">Floor:</label>
                <select
                  name="floor"
                  value={form.floor}
                  onChange={handleChange}
                  disabled={!isEditable}
                  required
                  className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-200"
                >
                  <option value="">Select Floor</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={i === 0 ? "Ground" : `${i}th`}>
                      {i === 0 ? "Ground" : `${i}th`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2 - Building & Mobile Number */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-lg text-gray-600">Building:</label>
                <select
                  name="building"
                  value={form.building}
                  onChange={handleChange}
                  disabled={!isEditable}
                  required
                  className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-200"
                >
                  <option value="">Select Building</option>
                  {[
                    "CCSIT",
                    "Medical",
                    "Pharmacy",
                    "Physical Education",
                    "Hostel (Boys)",
                    "Hostel (Girls)",
                  ].map((bld, idx) => (
                    <option key={idx} value={bld}>
                      {bld}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-lg text-gray-600">Mobile Number:</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={form.mobileNumber}
                  onChange={handleChange}
                  disabled={!isEditable}
                  required
                  maxLength="10"
                  className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <p className="text-red-600 text-sm">{error}</p>
            <button
              type="submit"
              disabled={!isEditable}
              className={`w-full mt-4 py-2 text-lg rounded-md transition-all duration-200 ${
                isEditable
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-700 cursor-not-allowed"
              }`}
            >
              Submit
            </button>
          </form>
        </div>

        {/* Saved Address Section */}
        <div className="bg-white p-5 rounded-lg shadow-md md:col-span-1">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Saved Address
          </h3>
          {address ? (
            <div className="p-4 bg-gray-50 rounded-lg border">
              <p className="mb-4 text-lg text-gray-800">
                Room Number: {address.classNumber}, {address.floor} Floor,{" "}
                <br />
                Building: {address.building}, <br />
                Mobile: {address.mobileNumber} <br /> TMU
              </p>
              <div className="flex justify-between">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-all duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={handleRemove}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all duration-200"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-lg">No address saved.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Address;
