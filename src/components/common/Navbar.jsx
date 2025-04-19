import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

const Navbar = ({ allItems }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ foods: [], restaurants: [] });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogo = () => {
    user ? navigate(`/${role}/${user.id}/home`) : navigate("/home");
  };

  const clickLogout = () => {
    localStorage.removeItem("user");
    setTimeout(() => {
      navigate("/home");
    }, 1000);
  };

  const isActive = (path) =>
    location.pathname === path ? "bg-orange-500 px-3 py-2 rounded-lg text-white" : "text-white";

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase().trim();
    setSearchQuery(e.target.value);

    if (!query) {
      setSearchResults({ foods: [], restaurants: [] });
      return;
    }

    const foodMatches = allItems
      ? allItems.filter(
          (item) =>
            item.name.toLowerCase().includes(query) || 
            item.restaurantName.toLowerCase().includes(query)
        )
      : [];

    const restaurantMatches = [
      ...new Set(
        allItems
          ?.filter((item) => item.restaurantName.toLowerCase().includes(query))
          .map((item) => item.restaurantName)
      ),
    ];

    setSearchResults({ foods: foodMatches, restaurants: restaurantMatches });
  };

  const handleSelectItem = (item, event) => {
    event.stopPropagation();
    setSearchQuery("");
    setSearchResults({ foods: [], restaurants: [] });
    navigate(`/home/${item.restaurantName}`);
  };

  const handleSelectRestaurant = (restaurant, event) => {
    event.stopPropagation();
    setSearchQuery("");
    setSearchResults({ foods: [], restaurants: [] });
    navigate(`/home/${restaurant}`);
  };

  return (
    <nav className="bg-orange-500 z-50 text-white w-full opacity-90 sticky top-0 shadow-md px-4 md:px-16">
      <div className="flex justify-between items-center h-[10vh]">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogo}>
          <img src={logo} alt="FOODHUB" className="h-12" />
          <div>
            <h1 className="font-bold text-2xl mt-2 leading-none">FOODHUB</h1>
            <h1 className="text-md text-gray-200 font-[cursive]">Food For Your Soul...</h1>
          </div>
        </div>
        

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex gap-6 text-lg items-center">
  {user && user.role === "user" && (
    <>
      <li className={`cursor-pointer flex items-center gap-2 ${isActive(`/user/${user.id}/home`)}`} onClick={() => navigate(`/user/${user.id}/home`)}>
        <i className="fa-solid fa-house"></i> Home
      </li>
      <li className={`cursor-pointer flex items-center gap-2 ${isActive(`/user/${user.id}/orders`)}`} onClick={() => navigate(`/user/${user.id}/orders`)}>
        <i className="fa-solid fa-box"></i> Orders
      </li>
      <li className={`cursor-pointer flex items-center gap-2 ${isActive(`/user/${user.id}/profile`)}`} onClick={() => navigate(`/user/${user.id}/profile`)}>
        <i className="fa-solid fa-user"></i> Profile
      </li>
      <li className={`cursor-pointer flex items-center gap-2 ${isActive(`/user/${user.id}/cart`)}`} onClick={() => navigate(`/user/${user.id}/cart`)}>
        <i className="fa-solid fa-cart-shopping"></i> Cart
      </li>
    </>
  )}

  {user && user.role === "admin" && (
    <li className={`cursor-pointer flex items-center gap-2 ${isActive(`/admin/${user.id}/dashboard`)}`} onClick={() => navigate(`/admin/${user.id}/dashboard`)}>
      <i className="fa-solid fa-chart-line"></i> Dashboard
    </li>
  )}

  {!user && (
    <>
      <li className={`cursor-pointer flex items-center gap-2 ${isActive("/menu")}`} onClick={() => navigate("/menu")}>
        <i className="fa-solid fa-utensils"></i> Menu
      </li>
      <li className={`cursor-pointer flex items-center gap-2 ${isActive("/admin/signup")}`} onClick={() => navigate("/admin/signup")}>
        <i className="fa-solid fa-user-shield"></i> Admin Signup
      </li>
      <li className={`cursor-pointer flex items-center gap-2 ${isActive("/user/signup")}`} onClick={() => navigate("/user/signup")}>
        <i className="fa-solid fa-user-plus"></i> User Signup
      </li>
      <li className={`cursor-pointer flex items-center gap-2 ${isActive("/login")}`} onClick={() => navigate("/login")}>
        <i className="fa-solid fa-right-to-bracket"></i> Login
      </li>
      <li className={`cursor-pointer flex items-center gap-2 ${isActive("/cart")}`} onClick={() => navigate("/cart")}>
        <i className="fa-solid fa-cart-shopping"></i> Cart
      </li>
    </>
  )}
  {user && (
  <div className="flex items-center gap-2">
  <h1 className="font-semibold">Welcome! <br></br>{user?.name}</h1>
  <button onClick={clickLogout} className="bg-red-600 px-1 rounded-full text-white cursor-pointer mb-5"> <i class="fa-solid fa-power-off"></i></button>
  </div>
)}
  
</ul>

        {/* Hamburger Icon - only mobile */}
        <div className="md:hidden flex items-center justify-between gap-4">
  {user && (
    <h1 className="font-semibold">Welcome! <br></br>{user?.name}</h1>
  )}
  
  <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
    <i className="fas fa-bars text-2xl"></i>
  </button>
</div>
      </div>

      {/* Search Bar (Full width) */}
      <div className="relative my-2 ">
        <input
          type="text"
          placeholder="Search food or restaurant..."
          className="w-full px-4 py-2 mb-4 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit" className="absolute right-4 top-2 text-black hover:text-gray-500">
          <i className="fa-solid fa-search"></i>
        </button>

        {(searchResults.foods.length > 0 || searchResults.restaurants.length > 0) && (
          <ul className="absolute top-full left-0 bg-white text-black border mt-1 w-full rounded-md shadow-md max-h-60 overflow-y-auto z-50">
            {searchResults.restaurants.length > 0 && (
              <>
                <li className="px-3 py-1 bg-gray-200 text-gray-700 font-semibold">Restaurants</li>
                {searchResults.restaurants.map((restaurant, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 cursor-pointer font-bold text-orange-600 hover:text-white hover:bg-orange-500"
                    onClick={(event) => handleSelectRestaurant(restaurant, event)}
                  >
                    🍽️ {restaurant}
                  </li>
                ))}
              </>
            )}
            {searchResults.foods.length > 0 && (
              <>
                <li className="px-3 py-1 bg-gray-200 text-gray-700 font-semibold">Food Items</li>
                {searchResults.foods.map((item, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 cursor-pointer flex justify-between hover:text-white hover:bg-orange-500"
                    onClick={(event) => handleSelectItem(item, event)}
                  >
                    <span>{item.name}</span>
                    <span className="text-sm text-gray-600">{item.restaurantName}</span>
                  </li>
                ))}
              </>
            )}
          </ul>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex gap-5 py-3 text-white text-base">
          
          {user && user.role === "user" && (
            <>
              <button onClick={() => navigate(`/user/${user.id}/home`)}>Home</button>
              <button onClick={() => navigate(`/user/${user.id}/orders`)}>Orders</button>
              <button onClick={() => navigate(`/user/${user.id}/profile`)}>Profile</button>
              <button onClick={() => navigate(`/user/${user.id}/cart`)}>Cart</button>
            </>
          )}
          {user && user.role === "admin" && (
            <button onClick={() => navigate(`/admin/${user.id}/dashboard`)}>Dashboard</button>
          )}
          {!user && (
            <>
              <button onClick={() => navigate("/menu")}>Menu</button>
              <button onClick={() => navigate("/admin/signup")}>Admin Signup</button>
              <button onClick={() => navigate("/user/signup")}>User Signup</button>
              <button onClick={() => navigate("/login")}>Login</button>
              <button onClick={() => navigate("/cart")}>Cart</button>
            </>
          )}
          {user && (
            <button onClick={clickLogout} className="bg-red-600 px-1 rounded-full text-white cursor-pointer"> <i class="fa-solid fa-power-off"></i></button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
