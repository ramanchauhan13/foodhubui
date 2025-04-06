import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";

const UserOrders = () => {
  const [liveOrders, setLiveOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `https://foodhubapi-1.onrender.com/api/user/${id}/orders`
        );
  
        const allLiveOrders = response.data.liveOrders || [];
        const allPastOrders = response.data.pastOrders || [];
  
        // Filter out rejected orders from live orders
        const filteredLiveOrders = allLiveOrders
          .filter((order) => order.status !== "Rejected")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first
  
        // Add rejected orders to past orders
        const updatedPastOrders = [
          ...allPastOrders,
          ...allLiveOrders.filter((order) => order.status === "Rejected"),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort past orders too
  
        setLiveOrders(filteredLiveOrders);
        setPastOrders(updatedPastOrders);
      } catch (err) {
        setError("No orders");
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [id]);

  // Cancel Order
  const cancelOrder = async (orderId) => {
    try {
      await axios.put(`https://foodhubapi-1.onrender.com/api/orders/${orderId}/cancel`);
      toast.success("Order cancelled successfully!");
      setLiveOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  };

  return (
    <div className="p-6 md:px-20 py-10 min-h-[90vh] bg-gray-200 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center text-orange-600">
        Your Orders
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading orders...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          {/* Live Orders */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-orange-700 mb-3">
              Live Orders
            </h2>
            <div className="space-y-4">
              {liveOrders.length > 0 ? (
                liveOrders.map((order, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105 border-l-4 border-orange-500"
                  >
                    {/* Restaurant Name */}
                    <div className="text-lg font-semibold text-gray-900">
                      {order.restaurantId?.restaurantName || "Unknown Restaurant"}
                    </div>

                    <div className="flex justify-between text-gray-700">
                      <span className="text-lg font-medium">
                        {order.items
                          .map((i) => `${i.name} (x${i.quantity})`)
                          .join(", ")}
                      </span>
                      <span className="text-sm">{moment(order.createdAt).format("DD MMM YYYY, hh:mm A")}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span
                        className={`text-sm font-semibold ${
                          order.status === "Out for Delivery"
                            ? "text-blue-700"
                            : order.status === "Pending"
                            ? "text-yellow-600"
                            : "text-green-700"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-md font-semibold text-black">
                        ₹
                        {order.items
                          .reduce((sum, i) => sum + i.price * i.quantity, 0)
                          .toFixed(2)}
                      </span>
                    </div>

                    {order.status === "Pending" && (
                      <button
                        className="mt-2 text-white bg-red-500 px-4 py-1 rounded-md hover:bg-red-700 transition"
                        onClick={() => cancelOrder(order._id)}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center">No live orders</p>
              )}
            </div>
          </div>

          {/* Past Orders */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Past Orders
            </h2>
            <div className="space-y-4">
              {pastOrders.length > 0 ? (
                pastOrders.map((order, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white shadow-md rounded-lg transition-transform transform hover:scale-105 border-l-4 border-gray-500"
                  >
                    {/* Restaurant Name */}
                    <div className="text-lg font-semibold text-gray-900">
                      {order.restaurantId?.restaurantName || "Unknown Restaurant"}
                    </div>

                    <div className="flex justify-between text-gray-700">
                      <span className="text-lg font-medium">
                        {order.items
                          .map((i) => `${i.name} (x${i.quantity})`)
                          .join(", ")}
                      </span>
                      <span className="text-sm">{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm font-semibold text-gray-700">
                        {order.status}
                      </span>
                      <span className="text-md font-semibold text-black">
                        ₹
                        {order.items
                          .reduce((sum, i) => sum + i.price * i.quantity, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center">No past orders</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserOrders;
