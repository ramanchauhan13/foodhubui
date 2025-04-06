import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function Section() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const { section, restaurants } = location.state;

  // Load existing cart from local storage or initialize an empty array
  const [cart, setCart] = useState(() => {
    const existingCart = localStorage.getItem(`cart_${userId}`);
    return existingCart ? JSON.parse(existingCart) : [];
  });

  useEffect(() => {
    // Update local storage whenever the cart changes
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
  }, [cart, userId]);

  const handleAddToCart = (item, restaurant) => {
    const restaurantId = restaurant.restaurantId || restaurant.id || restaurant._id;
    
    if (!restaurantId) {
      console.error("Restaurant ID is missing:", restaurant);
      return;
    }

    // Check if restaurant already exists in the cart
    const restaurantIndex = cart.findIndex((r) => r.restaurantId === restaurantId);
  
    if (restaurantIndex > -1) {
      // Check if the item already exists in the restaurant's cart
      const itemIndex = cart[restaurantIndex].items.findIndex((i) => i.name === item.name);
  
      if (itemIndex > -1) {
        // If item exists, increase quantity
        const updatedCart = [...cart];
        updatedCart[restaurantIndex].items[itemIndex].quantity += 1;
        setCart(updatedCart);
      } else {
        // If item does not exist, add it with section and quantity
        const updatedCart = [...cart];
        updatedCart[restaurantIndex].items.push({
          ...item,
          section,
          quantity: 1,
        });
        setCart(updatedCart);
      }
    } else {
      // If restaurant does not exist, create a new entry
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

    // alert(`${item.name} has been added to your cart!`);
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
        {section} Items
      </h1>
      <div className="space-y-8 max-w-6xl mx-auto">
        {restaurants.map((restaurant) => (
          <div key={restaurant.restaurantName} className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">{restaurant.restaurantName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
              {restaurant.menu
                .filter((menuSection) => menuSection.section === section)
                .flatMap((menuSection) => menuSection.items)
                .map((item) => {
                  // Get the current item's quantity from the cart
                  const cartItem = cart
                    .flatMap((r) => r.items)
                    .find((i) => i.name === item.name) || {};

                  return (
                    <div key={item.name} className="bg-white border px-2 py-2 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-green-600 font-bold text-xl mt-2">Rs.{item.price}</p>
                      
                      {cartItem.quantity > 0 ? (
                        <div className="flex items-center mt-4">
                          <button
                            onClick={() => handleChangeQuantity(item, restaurant, (cartItem.quantity || 0) + 1)}
                            className="bg-red-500 text-white py-1 px-2 rounded hover:bg--600 transition"
                          >
                            +
                          </button>
                          <span className="mx-2">{cartItem.quantity}</span>
                          <button
                            onClick={() => {
                              if (cartItem.quantity > 0) {
                                handleChangeQuantity(item, restaurant, (cartItem.quantity || 0) - 1);
                              }
                            }}
                            className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 transition"
                          >
                            -
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item, restaurant)}
                          className="mt-4 bg-orange-500 text-white py-1 px-2 rounded-2xl cursor-pointer transition"
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
    </div>
  );
}

export default Section;
