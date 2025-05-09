import {React,useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data , setData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const adminId = user?.id;
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const fetchData = async()=>{
    try{
      const response = await axios.get(`${baseURL}/restaurant/${adminId}/orders`);
      setData(response.data);
      // console.log("Orders Data:", response.data);
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, [adminId]);


console.log(data)

const totalOrders = data.length;
const totalRevenue = data.reduce((acc, order) => acc + order.totalPrice, 0);

const getTodaySales = () => {
  const today = new Date().toISOString().slice(0, 10); // format: YYYY-MM-DD

  const todayOrders = data.filter(order => {
    const orderDate = new Date(order.createdAt).toISOString().slice(0, 10);
    return orderDate === today && order.status === "Delivered";
  });

  return todayOrders.reduce((sum, order) => sum + order.totalPrice, 0);
};
 const todaySales = getTodaySales();

const totalCustomers = () => {
  const customerSet = new Set();

  data.forEach(order => {
    const customerId = order.userId?._id;
    if (customerId) {
      customerSet.add(customerId);
    }
  });

  return customerSet.size;
};

const customerSet = totalCustomers();



// Group orders by month for chart
const getMonthlyOrders = () => {
  const monthlyMap = {};

  data.forEach(order => {
    const date = new Date(order.createdAt);
    const month = date.toLocaleString('default', { month: 'short' });
    monthlyMap[month] = (monthlyMap[month] || 0) + 1;
  });

  return Object.keys(monthlyMap).map(month => ({
    name: month,
    orders: monthlyMap[month]
  }));
};

// Group revenue by month
const getMonthlyRevenue = () => {
  const revenueMap = {};

  data.forEach(order => {
    const date = new Date(order.createdAt);
    const month = date.toLocaleString('default', { month: 'short' });
    revenueMap[month] = (revenueMap[month] || 0) + order.totalPrice;
  });

  return Object.keys(revenueMap).map(month => ({
    name: month,
    value: revenueMap[month]
  }));
};

// Group customers by department
const getCustomerDepartments = () => {
  const deptMap = {};

  data.forEach(order => {
    const dept = order.userId?.department || "Unknown";
    deptMap[dept] = (deptMap[dept] || 0) + 1;
  });

  return Object.keys(deptMap).map(dept => ({
    name: dept,
    customers: deptMap[dept]
  }));
};


  const orderData = 
    getMonthlyOrders();
  

  const revenueData = getMonthlyRevenue();

  const customerLocationData = getCustomerDepartments();

  console.log("Customer Location Data:", customerLocationData);

  const customerInfoData = [
    { name: "Regular", value: 10 },
    { name: "New", value: 5 },
  ];

  const COLORS = ["#FFBB28", "#FF8042", "#00C49F", "#0088FE"];

  return (
    <div className="flex bg-gray-100 py-2 min-h-screen">
      <main className="flex-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          <button className="bg-orange-500 rounded-lg text-center text-white shadow font-bold text-md p-2 hover:bg-orange-600">
            Total Orders <br />{totalOrders}
          </button>
          <button className="bg-red-500 rounded-lg text-center text-white shadow font-bold text-md p-2 hover:bg-red-600">
          Total Customers<br />{customerSet}
          </button>
          <button className="bg-orange-400 rounded-lg text-center text-white shadow font-bold text-md p-2 hover:bg-orange-500">
            Today Sale <br />₹{todaySales}
          </button>
          <button className="bg-orange-600 rounded-lg text-center text-white shadow font-bold text-md p-2 hover:bg-orange-700">
            Total Revenue <br />₹{totalRevenue}
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
