import React from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const orderData = [
    { name: "Nov", orders: 30 },
    { name: "Dec", orders: 50 },
    { name: "Jan", orders: 40 },
    { name: "Feb", orders: 60 },
  ];

  const revenueData = [
    { name: "North", value: 4000 },
    { name: "South", value: 3000 },
    { name: "East", value: 2000 },
    { name: "West", value: 5000 },
  ];

  const customerLocationData = [
    { name: "MEDICAL", customers: 500 },
    { name: "CCSIT", customers: 700 },
    { name: "DENTAL", customers: 600 },
    { name: "FOE", customers: 500 },
    { name: "HOSTEL", customers: 800 }
  ];

  const customerInfoData = [
    { name: "Regular", value: 500 },
    { name: "New", value: 200 },
  ];

  const COLORS = ["#FFBB28", "#FF8042", "#00C49F", "#0088FE"];

  return (
    <div className="flex bg-gray-100 py-2 min-h-screen">
      <main className="flex-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          <button className="bg-orange-500 rounded-lg text-center text-white shadow font-bold text-md p-2 hover:bg-orange-600">
            Total Orders <br />190
          </button>
          <button className="bg-red-500 rounded-lg text-center text-white shadow font-bold text-md p-2 hover:bg-red-600">
            Total Menu <br />507
          </button>
          <button className="bg-orange-400 rounded-lg text-center text-white shadow font-bold text-md p-2 hover:bg-orange-500">
            Total Customers<br />9040
          </button>
          <button className="bg-orange-600 rounded-lg text-center text-white shadow font-bold text-md p-2 hover:bg-orange-700">
            Total Revenue <br />₹9040
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
          <div className="bg-white p-2 shadow rounded-lg flex flex-col h-full">
            <h2 className="font-bold text-md mb-2">Customer Location Chart</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={customerLocationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="customers" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-2 shadow rounded-lg flex flex-col h-full">
            <h2 className="font-bold text-md mb-2">Customer Info Chart</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={customerInfoData} cx="50%" cy="50%" outerRadius={50} fill="#8884d8" dataKey="value" label>
                  {customerInfoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend fontSize={10} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-2 overflow-hidden">
          <div className="bg-white p-2  shadow rounded-lg flex flex-col h-full">
            <h2 className="font-bold text-md mb-2">Order Summary Chart</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-2 shadow rounded-lg flex flex-col h-full">
            <h2 className="font-bold text-md mb-2">Revenue Chart</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={revenueData} cx="50%" cy="50%" outerRadius={50} fill="#8884d8" dataKey="value" label>
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend fontSize={10} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
