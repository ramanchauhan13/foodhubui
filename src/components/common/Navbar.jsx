// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import logo from "../../assets/logo.png";

// const Navbar = ({ allItems }) => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const role = user?.role;
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState({ foods: [], restaurants: [] });

//   const handleLogo = () => {
//     user ? navigate(`/${role}/${user.id}/home`) : navigate("/home");
//   };

//   const clickLogout = () => {
//     localStorage.removeItem("user");
//     setTimeout(() => {
//       navigate("/home");
//     }, 1000);
//   };

//   const isActive = (path) =>
//     location.pathname === path ? "bg-orange-500 px-3 py-2 rounded-lg text-white" : "text-white";

  
//   const handleSearchChange = (e) => {
//     const query = e.target.value.toLowerCase().trim();
//     setSearchQuery(e.target.value);

//     if (!query) {
//       setSearchResults({ foods: [], restaurants: [] });
//       return;
//     }

//     // Filter food items
//     const foodMatches = allItems
//       ? allItems.filter(
//           (item) =>
//             item.name.toLowerCase().includes(query) || 
//             item.restaurantName.toLowerCase().includes(query)
//         )
//       : [];

//     // Extract unique restaurant names
//     const restaurantMatches = [
//       ...new Set(
//         allItems
//           ?.filter((item) => item.restaurantName.toLowerCase().includes(query))
//           .map((item) => item.restaurantName)
//       ),
//     ];

//     setSearchResults({ foods: foodMatches, restaurants: restaurantMatches });
//   };

//   const handleSelectItem = (item, event) => {
//     event.stopPropagation();
//     setSearchQuery("");
//     setSearchResults({ foods: [], restaurants: [] });
//     navigate(`/home/${item.restaurantName}`);
//   };

//   const handleSelectRestaurant = (restaurant, event) => {
//     event.stopPropagation();
//     setSearchQuery("");
//     setSearchResults({ foods: [], restaurants: [] });
//     navigate(`/home/${restaurant}`);
//   };

//   return (
//     <nav className="bg-orange-500 z-50 text-white w-full h-[10vh] opacity-90 sticky top-0 shadow-md flex justify-between items-center px-8 md:px-16">
//       {/* Logo */}
//       <div className="flex items-center gap-4 cursor-pointer" onClick={handleLogo}>
//         <img src={logo} alt="FOODHUB" className="h-12" />
//         <div>
//           <h1 className="font-bold text-2xl font-[cursive]">FOODHUB</h1>
//           <h2 className="text-sm text-gray-300">Food For Your Soul...</h2>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="relative flex items-center">
//         <input
//           type="text"
//           placeholder="Search food or restaurant..."
//           className="px-4 py-1 w-80 pr-10 bg-white text-black rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-gray-700"
//           value={searchQuery}
//           onChange={handleSearchChange}
//         />
//         <button type="submit" className="absolute right-3 cursor-pointer text-black hover:text-gray-500">
//           <i className="fa-solid fa-search"></i>
//         </button>

//         {/* Dropdown for search results */}
//         {(searchResults.foods.length > 0 || searchResults.restaurants.length > 0) && (
//           <ul className="absolute top-full left-0 bg-white text-black border mt-1 w-full rounded-md shadow-md max-h-60 overflow-y-auto">
//             {/* Restaurant Matches */}
//             {searchResults.restaurants.length > 0 && (
//               <>
//                 <li className="px-3 py-1 bg-gray-200 text-gray-700 font-semibold">Restaurants</li>
//                 {searchResults.restaurants.map((restaurant, index) => (
//                   <li
//                     key={index}
//                     className="px-3 py-2 cursor-pointer font-bold text-orange-600 hover:text-white hover:bg-orange-500"
//                     onClick={(event) => handleSelectRestaurant(restaurant, event)}
//                   >
//                     🍽️ {restaurant}
//                   </li>
//                 ))}
//               </>
//             )}

//             {/* Food Matches */}
//             {searchResults.foods.length > 0 && (
//               <>
//                 <li className="px-3 py-1 bg-gray-200 text-gray-700 font-semibold">Food Items</li>
//                 {searchResults.foods.map((item, index) => (
//                   <li
//                     key={index}
//                     className="px-3 py-2 cursor-pointer flex justify-between hover:text-white hover:bg-orange-500"
//                     onClick={(event) => handleSelectItem(item, event)}
//                   >
//                     <span>{item.name}</span>
//                     <span className="text-sm text-gray-600">{item.restaurantName}</span>
//                   </li>
//                 ))}
//               </>
//             )}
//           </ul>
//         )}
//       </div>

//       {/* Navigation Links */}
//       <ul className="h-full text-lg items-center flex list-none gap-15">
//         {user && user.role === "user" && (
//           <>
//             <li className={`cursor-pointer hover:text-white ${isActive(`/user/${user.id}/home`)}`}
//                 onClick={() => navigate(`/user/${user.id}/home`)}>
//               <i className="fa-solid fa-house pr-2"></i>Home
//             </li>
//             <li className={`cursor-pointer hover:text-white ${isActive(`/user/${user.id}/orders`)}`}
//                 onClick={() => navigate(`/user/${user.id}/orders`)}>
//               <i className="fa-regular fa-address-book pr-2"></i>Orders
//             </li>
//             <li className={`cursor-pointer hover:text-white ${isActive(`/user/${user.id}/profile`)}`}
//                 onClick={() => navigate(`/user/${user.id}/profile`)}>
//               <i className="fa-solid fa-user pr-2"></i>Profile
//             </li>
//             <li className={`cursor-pointer hover:text-white ${isActive(`/user/${user.id}/cart`)}`}
//                 onClick={() => navigate(`/user/${user.id}/cart`)}>
//               <i className="fa-solid fa-cart-shopping pr-1"></i>Cart
//             </li>
//           </>
//         )}

// {user && user.role === "admin" && (
//     <>
//       <li className={`cursor-pointer hover:text-white ${isActive(`/admin/${user.id}/dashboard`)}`}
//           onClick={() => navigate(`/admin/${user.id}/dashboard`)}>
//         <i className="fa-solid fa-chart-line pr-2"></i>Dashboard
//       </li>
//     </>
//   )}
//       </ul>

//       {/* User Actions */}
//       {user ? (
//         <div className="flex h-full gap-6 items-center">
//           <div className="font-bold text-right">
//             <p className="text-white">Welcome, {user.name}</p>
//             <p className="text-sm text-gray-200 capitalize">{user.role}</p>
//           </div>
//           <button
//             onClick={clickLogout}
//             className="text-red-600 bg-white px-2 py-2 text-lg rounded-full hover:bg-red-600 hover:text-white"
//           >
//             <i className="fas fa-sign-out pr-2"></i>
//             Logout
//           </button>
//         </div>
//       ) : (
//         <ul className="list-none h-fullitems-center  flex text-lg gap-8">
//           <li className={`cursor-pointer  hover:text-white ${isActive("/menu")}`}
//               onClick={() => navigate("/menu")}>
//             <i className="fa-solid fa-bowl-food pr-2 "></i>Menu
//           </li>
//           <li className={`cursor-pointer hover:text-white ${isActive("/admin/signup")}`}
//               onClick={() => navigate("/admin/signup")}>
//             <i className="fa-solid fa-user pr-2"></i>Admin Signup
//           </li>
//           <li className={`cursor-pointer hover:text-white ${isActive("/user/signup")}`}
//               onClick={() => navigate("/user/signup")}>
//             <i className="fa-solid fa-user-plus pr-2"></i>User Signup
//           </li>
//           <li className={`cursor-pointer hover:text-white ${isActive("/login")}`}
//               onClick={() => navigate("/login")}>
//             <i className="fa-solid fa-arrow-right-to-bracket pr-2"></i>Login
//           </li>
//           <li className={`cursor-pointer hover:text-white ${isActive("/cart")}`}
//               onClick={() => navigate("/cart")}>
//             <i className="fa-solid fa-cart-shopping pr-1"></i>Cart
//           </li>
//         </ul>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
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
        <div className="flex items-center gap-4 cursor-pointer" onClick={handleLogo}>
          <img src={logo} alt="FOODHUB" className="h-12" />
          <div>
            <h1 className="font-bold text-2xl ">FOODHUB</h1>
            <h2 className="text-sm text-gray-300 font-[cursive]">Food For Your Soul...</h2>
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
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>
      </div>

      {/* Search Bar (Full width) */}
      <div className="relative my-2">
        <input
          type="text"
          placeholder="Search food or restaurant..."
          className="w-full px-4 py-2 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
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
        <div className="md:hidden flex flex-col gap-3 py-3 text-white text-base">
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
            <button onClick={clickLogout} className="text-red-600 bg-white py-2 rounded-lg mt-2 hover:bg-red-600 hover:text-white">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

