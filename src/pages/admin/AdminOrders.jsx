import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";

const Orders = ({ adminId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!adminId) {
        toast.error("Admin ID is missing!");
        return;
      }
      try {
        const response = await axios.get(
          `https://foodhubapi-1.onrender.com/api/admin/${adminId}/orders`
        );
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
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [adminId]);

  const updateOrderStatus = async (orderId, restaurantId, newStatus) => {
    try {
      const response = await axios.put(
        `https://foodhubapi-1.onrender.com/api/admin/orders/${orderId}/status`,
        { status: newStatus, restaurantId }
      );

      if (response.status === 200) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
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

  // Group orders by date
  const groupedOrders = orders.reduce((acc, order) => {
    const date = moment(order.createdAt).format("YYYY-MM-DD");
    if (!acc[date]) acc[date] = [];
    acc[date].push(order);
    return acc;
  }, {});

  const todayDate = moment().format("YYYY-MM-DD");

  return (
    <>
      <div className="">
        <h2 className="text-3xl bg-orange-500 py-4 my-4 font-bold text-center">
          Manage Orders
        </h2>

        {Object.keys(groupedOrders).length === 0 ? (
          <p className="text-center text-lg font-medium">No orders found.</p>
        ) : (
          Object.keys(groupedOrders).map((date, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-2xl font-semibold mb-2 bg-gray-300 p-1 rounded-md text-center">
                {date === todayDate
                  ? "📌 Today's Orders"
                  : moment(date).format("DD MMMM YYYY")}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-400">
                  <thead>
                    <tr className="bg-gray-200 text-lg">
                      <th className="border p-1">Time</th>
                      <th className="border">User</th>
                      <th className="border ">Items</th>
                      <th className="border ">Total Price</th>
                      <th className="border">Status</th>
                      <th className="border ">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedOrders[date].map((order, idx) => (
                      <tr key={idx} className="border text-center text-lg">
                        <td className="border">
                          {moment(order.createdAt).format("hh:mm A")}
                        </td>
                        <td className="border">
                          {order.userId?.name || "N/A"}
                        </td>
                        <td className="border p-3">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-gray-700">
                                <th className="text-left p-1">Item</th>
                                <th className="text-center p-1">Qty</th>
                                {/* <th className="text-right p-1">Price</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map((item, i) => (
                                <tr key={i}>
                                  <td className="text-left p-1">{item.name}</td>
                                  <td className="text-center p-1">
                                    {item.quantity}x
                                  </td>
                                  {/* <td className="text-right p-1">₹{item.price}</td> */}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                        <td className="border font-semibold">
                          ₹
                          {order.items
                            .reduce(
                              (sum, item) => sum + item.price * item.quantity,
                              0
                            )
                            .toFixed(2)}
                        </td>
                        <td className="border font-semibold">
                          {order.status || "Pending"}
                        </td>
                        <td className="border space-x-2">
                          {order.status === "Pending" && (
                            <>
                              <button
                                onClick={() =>
                                  updateOrderStatus(
                                    order._id,
                                    order.restaurantId._id,
                                    "Accepted"
                                  )
                                }
                                className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  updateOrderStatus(
                                    order._id,
                                    order.restaurantId._id,
                                    "Rejected"
                                  )
                                }
                                className="bg-red-500 text-white px-2 py-2 rounded-md"
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
                                  "Out for Delivery"
                                )
                              }
                              className="bg-yellow-500 text-white px-2 py-2 rounded-md"
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
                                  "Delivered"
                                )
                              }
                              className="bg-blue-500 text-white px-2 py-2 rounded-md"
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
