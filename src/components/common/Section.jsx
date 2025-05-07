import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function Section() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const { section, restaurants } = location.state;

  const [cart, setCart] = useState(() => {
    const existingCart = localStorage.getItem(`cart_${userId}`);
    return existingCart ? JSON.parse(existingCart) : [];
  });

  useEffect(() => {
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
  }, [cart, userId]);

  const handleAddToCart = (item, restaurant) => {
    if(!user) return toast.error("Please Login To Add Item In Cart");
    const restaurantId = restaurant.restaurantId || restaurant.id || restaurant._id;
    if (!restaurantId) return;

    const restaurantIndex = cart.findIndex((r) => r.restaurantId === restaurantId);

    if (restaurantIndex > -1) {
      const itemIndex = cart[restaurantIndex].items.findIndex((i) => i.name === item.name);

      if (itemIndex > -1) {
        const updatedCart = [...cart];
        updatedCart[restaurantIndex].items[itemIndex].quantity += 1;
        setCart(updatedCart);
      } else {
        const updatedCart = [...cart];
        updatedCart[restaurantIndex].items.push({
          ...item,
          section,
          quantity: 1,
        });
        setCart(updatedCart);
      }
    } else {
      const newEntry = {
        restaurantId,
        restaurantName: restaurant.restaurantName,
        userId,
        items: [{
          ...item,
          section,
          quantity: 1,
        }],
      };
      setCart([...cart, newEntry]);
    }
  };

  const handleChangeQuantity = (item, restaurant, quantity) => {
    const restaurantId = restaurant.restaurantId || restaurant.id || restaurant._id;

    const updatedCart = cart.map((r) => {
      if (r.restaurantId === restaurantId) {
        const updatedItems = r.items.map((i) => {
          if (i.name === item.name) {
            return { ...i, quantity };
          }
          return i;
        });
        return { ...r, items: updatedItems };
      }
      return r;
    });

    setCart(updatedCart);
  };

  return (
    <div className="p-8 bg-gray-200 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 capitalize">
        {section}
      </h1>

      <div className="space-y-12 max-w-7xl mx-auto">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.restaurantName}
            className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-200"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
              {restaurant.restaurantName}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {restaurant.menu
                .filter((menuSection) => menuSection.section === section)
                .flatMap((menuSection) => menuSection.items)
                .map((item) => {
                  const cartItem = cart
                    .flatMap((r) => r.items)
                    .find((i) => i.name === item.name) || {};

                  return (
                    <div
                      key={item.name}
                      className="bg-white p-2 md:p-4 border border-gray-300 rounded-2xl shadow-sm hover:shadow-md transition-transform hover:scale-[1.03] flex flex-row md:flex-col justify-between items-center"
                    >
                      <div className="w-14 h-14 md:w-58 md:h-34">
                        <img src={item.itemImg} alt={item.name} className="border w-full h-full object-cover rounded-lg" />
                      </div>
                      <div className="my-2">
                      <p className="text-md font-semibold">{item.name}</p>
                        <p className="text-sm font-bold text-start md:text-center">₹{item.price}</p>
                        </div>

                      {cartItem.quantity > 0 ? (
                        <div className="flex items-center justify-between mt-6">
                          <button
                            onClick={() => {
                              if (cartItem.quantity > 0) {
                                handleChangeQuantity(item, restaurant, (cartItem.quantity || 0) - 1);
                              }
                            }}
                            className="bg-red-500 text-white w-8 h-8 text-lg cursor-pointer font-bold rounded-full hover:bg-red-600 transition"
                          >
                            -
                          </button>
                          <span className="font-semibold text-gray-700 mx-3 text-lg">{cartItem.quantity}</span>
                          <button
                            onClick={() =>
                              handleChangeQuantity(item, restaurant, (cartItem.quantity || 0) + 1)
                            }
                            className="bg-green-500 text-white w-8 h-8 text-lg cursor-pointer font-bold rounded-full hover:bg-green-600 transition"
                          >
                            +
                          </button>
                          
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item, restaurant)}
                          className="w-20 h-10 md:w-18 bg-orange-500 text-white cursor-pointer font-semibold py-2 rounded-full hover:bg-orange-600 transition"
                        >
                          ADD
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Section;
