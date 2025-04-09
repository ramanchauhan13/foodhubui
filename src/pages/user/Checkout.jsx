import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

const Checkout = () => {
  const user = localStorage.getItem("user"); // Get user from localStorage
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const {id}=useParams();
  console.log(cart);

  // Load cart from localStorage when component mounts
  useEffect(() => {
    if (user) {
      const storedCart = JSON.parse(localStorage.getItem(`cart_${id}`)) || [];
      console.log("Stored Cart:", storedCart);
      setCart(storedCart);
    }
  }, [user]);

  // Update localStorage whenever cart changes
  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem(`cart_${id}`, JSON.stringify(updatedCart));
  };

  // Increase/Decrease quantity of an item
  const handleQuantityChange = (restaurantId, itemId, change) => {
    const updatedCart = cart.map((restaurant) => {
      if (restaurant.restaurantId === restaurantId) {
        return {
          ...restaurant,
          items: restaurant.items.map((item) =>
            item._id === itemId
              ? { ...item, quantity: Math.max(1, item.quantity + change) }
              : item
          ),
        };
      }
      return restaurant;
    });

    updateCart(updatedCart);
  };

  // Remove an item from the cart
  const handleRemoveItem = (restaurantId, itemId) => {
    const updatedCart = cart
      .map((restaurant) => {
        if (restaurant.restaurantId === restaurantId) {
          return {
            ...restaurant,
            items: restaurant.items.filter((item) => item._id !== itemId),
          };
        }
        return restaurant;
      })
      .filter((restaurant) => restaurant.items.length > 0); // Remove empty restaurants

    updateCart(updatedCart);
    toast.error("Item removed from cart", { autoClose: 100 });
  };

  if (!user) {
    return (
      <div className="flex flex-col sm:mt-30 sm:my-0 my-20 justify-center items-center">
        <p className="text-lg">Please log in to view your cart.</p>
        <button
          onClick={()=>navigate("/login")}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col justify-center sm:mt-30 sm:my-0 my-20 items-center">
        <h1 className="text-3xl font-bold  text-center w-full py-3 text-red-600">Your FoodHub cart is empty</h1>
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
      <ToastContainer position="top-right" />

      <h1 className="sm:text-3xl text-xl font-bold py-3 text-center text-gray-800">Your Cart</h1>

      <div className="mx-auto mb-8 space-y-6">
        {cart.map((restaurant) => (
          <div key={restaurant.restaurantId} className="p-6 bg-white sm:rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
              {restaurant.restaurantName}
            </h2>

            <ul className="mt-4 space-y-4">
              {restaurant.items.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm"
                >
                  <div className="flex flex-col">
                    <span className="text-lg font-medium text-gray-800">{item.name}</span>
                    <span className="text-sm text-gray-600">₹{item.price} x {item.quantity}</span>
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={() => handleQuantityChange(restaurant.restaurantId, item._id, -1)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                    >
                      −
                    </button>
                    <span className="mx-3 text-lg font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(restaurant.restaurantId, item._id, 1)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveItem(restaurant.restaurantId, item._id)}
                      className="ml-4 bg-gray-700 hover:bg-gray-800 text-white px-4 py-1 rounded-lg transition"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Checkout;
