import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const deliveryBoyOptions = ["Ravi", "Amit", "Suresh"];

const Orders = ({ adminId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!adminId) {
        toast.error("Admin ID is missing!");
        return;
      }
      try {
        const response = await axios.get(`${baseURL}/admin/${adminId}/orders`);
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to fetch orders!");
        setOrders([]);
      }
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [adminId]);

  const handleDeliveryBoyChange = (orderId, deliveryBoy) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, deliveryBoy } : order
      )
    );
  };

  const updateOrderStatus = async (orderId, restaurantId, newStatus, deliveryBoy) => {
    if (newStatus === "Out for Delivery" && !deliveryBoy) {
      toast.error("Please select a delivery boy before proceeding.");
      return;
    }
  
    let deliveryTime = null;
    if (newStatus === "Accepted") {
      deliveryTime = 20;
    } else if (newStatus === "Out for Delivery") {
      deliveryTime = 10;
    }
  
    try {
      const response = await axios.put(`${baseURL}/admin/orders/${orderId}/status`, {
        status: newStatus,
        restaurantId,
        deliveryBoy,
        deliveryTime,
      });
  
      if (response.status === 200) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, status: newStatus, deliveryBoy, deliveryTime }
              : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update order status!"
      );
    }
  };
  

  const groupedOrders = orders.reduce((acc, order) => {
    const date = moment(order.createdAt).format("YYYY-MM-DD");
    if (!acc[date]) acc[date] = [];
    acc[date].push(order);
    return acc;
  }, {});

  const todayDate = moment().format("YYYY-MM-DD");

  return (
    <>
      <div className="px-2 sm:px-4 md:px-8">
        <h2 className="text-2xl sm:text-3xl bg-orange-500 py-3 sm:py-4 my-4 font-bold text-center text-white rounded-md">
          Manage Orders
        </h2>

        {Object.keys(groupedOrders).length === 0 ? (
          <p className="text-center text-lg font-medium">No orders found.</p>
        ) : (
          Object.keys(groupedOrders).map((date, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 bg-gray-300 p-2 rounded-md text-center">
                {date === todayDate
                  ? "📌 Today's Orders"
                  : moment(date).format("DD MMMM YYYY")}
              </h3>

              <div className="overflow-x-auto">
                <table className="min-w-[600px] w-full border-collapse border border-gray-400 text-sm sm:text-base">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">Time</th>
                      <th className="border p-2">User</th>
                      <th className="border p-2">Items</th>
                      <th className="border p-2">Total Price</th>
                      <th className="border p-2">Status</th>
                      <th className="border p-2">Delivery Boy</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedOrders[date].map((order, idx) => (
                      <tr key={idx} className="border text-center">
                        <td className="border p-2">
                          {moment(order.createdAt).format("hh:mm A")}
                        </td>
                        <td className="border p-2">
                          {order.userId?.name || "N/A"}
                        </td>
                        <td className="border p-2">
                          <table className="w-full text-xs sm:text-sm">
                            <tbody>
                              {order.items.map((item, i) => (
                                <tr key={i}>
                                  <td className="text-left p-1">{item.name}</td>
                                  <td className="text-center p-1">
                                    {item.quantity}x
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                        <td className="border font-semibold p-2">
                          ₹
                          {order.items
                            .reduce(
                              (sum, item) => sum + item.price * item.quantity,
                              0
                            )
                            .toFixed(2)}
                        </td>
                        <td className="border font-semibold p-2">
                          {order.status || "Pending"}
                        </td>
                        <td className="border p-2">
                          {order.status === "Accepted" ? (
                            <select
                              value={order.deliveryBoy || ""}
                              onChange={(e) =>
                                handleDeliveryBoyChange(order._id, e.target.value)
                              }
                              className="border px-2 py-1 rounded"
                            >
                              <option value="">Select</option>
                              {deliveryBoyOptions.map((boy) => (
                                <option key={boy} value={boy}>
                                  {boy}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="font-medium text-sm">
                              {order.deliveryBoy || "N/A"}
                            </span>
                          )}
                        </td>
                        <td className="border p-2 space-x-2">
                          {order.status === "Pending" && (
                            <>
                              <button
                                onClick={() =>
                                  updateOrderStatus(order._id, order.restaurantId._id, "Accepted")
                                }
                                className="bg-green-500 text-white px-3 py-1 rounded-md"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  updateOrderStatus(order._id, order.restaurantId._id, "Rejected")
                                }
                                className="bg-red-500 text-white px-3 py-1 rounded-md"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {order.status === "Accepted" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(
                                  order._id,
                                  order.restaurantId._id,
                                  "Out for Delivery",
                                  order.deliveryBoy
                                )
                              }
                              className="bg-yellow-500 text-white px-3 py-1 rounded-md"
                            >
                              Out for Delivery
                            </button>
                          )}
                          {(order.status === "Accepted" ||
                            order.status === "Out for Delivery") && (
                            <button
                              onClick={() =>
                                updateOrderStatus(
                                  order._id,
                                  order.restaurantId._id,
                                  "Delivered",
                                  order.deliveryBoy
                                )
                              }
                              className="bg-blue-500 text-white px-3 py-1 rounded-md"
                            >
                              Delivered
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default Orders;
