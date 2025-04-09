import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import image from "../../assets/menusec.jpg";
import slide1 from "../../assets/slide1.jpg";

const Restaurant = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name } = useParams(); // Get restaurant name from URL

  const [restaurant, setRestaurant] = useState(location.state?.restaurant || null);
  const [loading, setLoading] = useState(!restaurant);
  const [cart, setCart] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!restaurant) {
      // Fetch restaurant details if opened via direct URL
      axios.get(`https://foodhubapi-1.onrender.com/api/home/${name}`)
        .then((response) => setRestaurant(response.data))
        .catch((error) => {
          console.error("Error fetching restaurant:", error);
          toast.error("Restaurant not found!");
          navigate("/home"); // Redirect if not found
        })
        .finally(() => setLoading(false));
    }
  }, [name, restaurant, navigate]);

  useEffect(() => {
    if (user) {
      const storedCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
      setCart(storedCart);
    }
  }, [userId]);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
  };

  const handleAddToCart = (item, section) => {
    if (!userId) {
      toast.error("Please log in to add items to the cart!");
      return;
    }

    const updatedCart = [...cart];
    const restaurantIndex = updatedCart.findIndex((r) => r.restaurantName === restaurant.restaurantName);

    if (restaurantIndex !== -1) {
      const existingItemIndex = updatedCart[restaurantIndex].items.findIndex(
        (cartItem) => cartItem._id === item._id
      );

      if (existingItemIndex !== -1) {
        updatedCart[restaurantIndex].items[existingItemIndex].quantity += 1;
        // toast.info(`Quantity increased: ${item.name}`, { autoClose: 1500 });
      } else {
        updatedCart[restaurantIndex].items.push({
          ...item,
          section: section.section,
          quantity: 1,
        });
        // toast.success(`Added to cart: ${item.name}`, { autoClose: 1500 });
      }
    } else {
      updatedCart.push({
        userId: userId,
        restaurantId: restaurant.restaurantId || restaurant._id,
        restaurantName: restaurant.restaurantName,
        items: [{ ...item, section: section.section, quantity: 1 }],
      });
      toast.success(`Added to cart: ${item.name}`, { autoClose: 1500 });
    }

    updateCart(updatedCart);
  };

  const handleChangeQuantity = (item, change) => {
    const updatedCart = cart.map((restaurant) => {
      if (restaurant.restaurantName === restaurant.restaurantName) {
        const updatedItems = restaurant.items.map((cartItem) => {
          if (cartItem._id === item._id) {
            return { ...cartItem, quantity: cartItem.quantity + change };
          }
          return cartItem;
        }).filter(cartItem => cartItem.quantity > 0); // Remove items with quantity 0

        return { ...restaurant, items: updatedItems };
      }
      return restaurant;
    }).filter(restaurant => restaurant.items.length > 0); // Remove empty restaurants

    updateCart(updatedCart);
  };

  const getItemQuantity = (item) => {
    const restaurantCart = cart.find(r => r.restaurantName === restaurant.restaurantName);
    return restaurantCart?.items.find(cartItem => cartItem._id === item._id)?.quantity || 0;
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!restaurant) return null;

  return (
    <div className="min-h-screen sm:px-8 px-0 py-1 text-black bg-gray-100">
    <ToastContainer position="top-right" />

    <div className="text-center mb-6">
      <h1 className="sm:text-3xl text-lg bg-orange-500 p-4 text-white uppercase font-bold">{restaurant.restaurantName}</h1>
      <img src={slide1} alt="Restaurant" className="w-full h-50 object-cover shadow-lg mt-3" />
    </div>

    <h2 className="text-2xl italic text-center my-6 border-b-2 font-bold border-gray-300 w-1/3 mx-auto uppercase">Menu</h2>

    {restaurant.menu.map((section) => (
      <div key={section._id} className="bg-gray-200 shadow-lg mb-6">
        <h2 className="text-xl font-bold px-2 p-2 uppercase">{section.section}</h2>
        <ul className="space-y-4">
          {section.items.map((item) => {
            const quantity = getItemQuantity(item);

            return (
              <li key={`${section._id}-${item._id}`} className="flex items-center justify-between bg-gray-100 p-3 sm:rounded-lg rounded-none shadow-sm">
                <div className="flex items-center space-x-4">
                  <img src={image} alt={item.name} className="w-14 h-14 rounded-md shadow-md" />
                  <div>
                    <p className="sm:text-lg text-md font-semibold">{item.name}</p>
                    <p className="text-sm font-bold">₹{item.price}</p>
                  </div>
                </div>
                {quantity > 0 ? (
                  <div className="flex items-center">
                    <button
                      onClick={() => handleChangeQuantity(item, -1)}
                      className="bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 transition"
                    >
                      -
                    </button>
                    <span className="mx-3 text-lg">{quantity}</span>
                    <button
                      onClick={() => handleChangeQuantity(item, 1)}
                      className="bg-green-500 text-white px-2 py-1 rounded-full hover:bg-green-600 transition"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddToCart(item, section)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-orange-600 transition"
                  >
                    ADD
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    ))}
  </div>
  );
};

export default Restaurant;
