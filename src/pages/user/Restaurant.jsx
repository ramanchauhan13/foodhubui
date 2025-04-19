import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import slide1 from "../../assets/slide1.jpg";
import Loader from "../../Loader"; // Import your loader here
const baseURL = import.meta.env.VITE_API_BASE_URL;

const Restaurant = () => {
  const { name } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(location.state?.restaurant || null);
  const [restaurantLoading, setRestaurantLoading] = useState(!restaurant);
  const [imageLoading, setImageLoading] = useState(true);
  const [itemImages, setItemImages] = useState({});
  const [cart, setCart] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const PEXELS_API_KEY = "sSfQGKJtC1XMCCIBlUzPZd0hoSKEYaRpyYAmUSEVldfWmODXn9MSWzjL";

  const getPexelsImage = async (query) => {
    try {
      const { data } = await axios.get(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
        headers: { Authorization: PEXELS_API_KEY },
      });
      return data.photos[0]?.src?.medium || null;
    } catch (err) {
      console.error("Pexels error:", err.message);
      return null;
    }
  };

  useEffect(() => {
    if (!restaurant) {
      axios.get(`${baseURL}/home/${name}`)
        .then((response) => setRestaurant(response.data))
        .catch((error) => {
          console.error("Error fetching restaurant:", error);
          toast.error("Restaurant not found!");
          navigate("/home");
        })
        .finally(() => setRestaurantLoading(false));
    } else {
      setRestaurantLoading(false);
    }
  }, [name, restaurant, navigate]);

  useEffect(() => {
    const fetchImages = async () => {
      if (!restaurant) return;
      const images = {};
      for (const section of restaurant.menu || []) {
        for (const item of section.items) {
          const img = await getPexelsImage(item.name);
          if (img) images[item._id] = img;
        }
      }
      setItemImages(images);
      setImageLoading(false);
    };
    restaurant && fetchImages();
  }, [restaurant]);

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
    if (!userId) return toast.error("Please log in to add items!");
    const updatedCart = [...cart];
    const restIndex = updatedCart.findIndex(r => r.restaurantName === restaurant.restaurantName);

    if (restIndex !== -1) {
      const itemIndex = updatedCart[restIndex].items.findIndex(i => i._id === item._id);
      itemIndex !== -1
        ? updatedCart[restIndex].items[itemIndex].quantity++
        : updatedCart[restIndex].items.push({ ...item, section: section.section, quantity: 1 });
    } else {
      updatedCart.push({
        userId,
        restaurantId: restaurant.restaurantId || restaurant._id,
        restaurantName: restaurant.restaurantName,
        items: [{ ...item, section: section.section, quantity: 1 }],
      });
      toast.success(`Added to cart: ${item.name}`, { autoClose: 1500 });
    }
    updateCart(updatedCart);
  };

  const handleChangeQuantity = (item, change) => {
    const updatedCart = cart.map(r => {
      if (r.restaurantName === restaurant.restaurantName) {
        const updatedItems = r.items
          .map(i => i._id === item._id ? { ...i, quantity: i.quantity + change } : i)
          .filter(i => i.quantity > 0);
        return { ...r, items: updatedItems };
      }
      return r;
    }).filter(r => r.items.length > 0);
    updateCart(updatedCart);
  };

  const getItemQuantity = (item) =>
    cart.find(r => r.restaurantName === restaurant.restaurantName)
      ?.items.find(i => i._id === item._id)?.quantity || 0;

  if (restaurantLoading || imageLoading)
    return <div className="min-h-screen flex justify-center items-center"><Loader /></div>;
  if (!restaurant) return null;

  return (
    <div className="min-h-screen sm:px-8 px-0 text-black bg-gray-100">
      <ToastContainer position="top-right" />
      <div className="text-center mb-6">
        <h1 className="sm:text-2xl text-xl bg-orange-500 p-4 text-white uppercase font-bold">
          {restaurant.restaurantName}
        </h1>
        <img src={restaurant.imageUrl || slide1} alt="Restaurant" className="w-full h-50 object-cover shadow-lg mt-3" />
      </div>

      <h2 className="text-2xl italic text-center my-6 border-b-2 font-bold border-gray-300 w-1/3 mx-auto uppercase">Menu</h2>

      {restaurant.menu.map((section) => (
        <div key={section._id} className="bg-gray-200 shadow-lg mb-6">
          <h2 className="text-xl font-bold px-2 p-2 uppercase">{section.section}</h2>

          {/* Mobile Layout */}
          <div className="sm:hidden">
            <ul className="space-y-4">
              {section.items.map((item) => {
                const quantity = getItemQuantity(item);
                const img = itemImages[item._id];
                return (
                  <li key={item._id} className="flex items-center justify-between bg-gray-100 p-3 rounded-md shadow-sm">
                    <div className="flex items-center space-x-4">
                      <img src={img} alt={item.name} className="w-14 h-14 rounded-md shadow-md" />
                      <div>
                        <p className="text-md font-semibold">{item.name}</p>
                        <p className="text-sm font-bold">₹{item.price}</p>
                      </div>
                    </div>
                    {quantity > 0 ? (
                      <div className="flex items-center">
                        <button onClick={() => handleChangeQuantity(item, -1)} className="bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600">-</button>
                        <span className="mx-3 text-lg">{quantity}</span>
                        <button onClick={() => handleChangeQuantity(item, 1)} className="bg-green-500 text-white px-2 py-1 rounded-full hover:bg-green-600">+</button>
                      </div>
                    ) : (
                      <button onClick={() => handleAddToCart(item, section)} className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600">ADD</button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
            {section.items.map((item) => {
              const quantity = getItemQuantity(item);
              const img = itemImages[item._id];
              return (
                <div key={item._id} className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center aspect-square hover:shadow-xl transition">
                  <img src={img} alt={item.name} className="w-58 h-34 object-cover rounded-lg mb-3 border" />
                  <div className="text-center">
                    <p className="text-base font-semibold">{item.name}</p>
                    <p className="text-sm font-bold text-gray-600">₹{item.price}</p>
                    {quantity > 0 ? (
                      <div className="flex items-center mt-2 space-x-3">
                        <button onClick={() => handleChangeQuantity(item, -1)} className="bg-red-500 text-white w-7 h-7 rounded-full hover:bg-red-600">-</button>
                        <span className="text-lg">{quantity}</span>
                        <button onClick={() => handleChangeQuantity(item, 1)} className="bg-green-500 text-white w-7 h-7 rounded-full hover:bg-green-600">+</button>
                      </div>
                    ) : (
                      <button onClick={() => handleAddToCart(item, section)} className="mt-2 bg-orange-500 text-white px-5 py-1.5 rounded-full hover:bg-orange-600">ADD</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Restaurant;
