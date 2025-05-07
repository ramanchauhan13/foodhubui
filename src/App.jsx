import UserSignup from "./pages/user/UserSignup"
import './App.css';
import React from 'react';
import axios from "axios";
import AdminSignup from "./pages/admin/AdminSignup"
import Login from './pages/auth/Login';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Content from "./components/common/Content";
import Section from "./components/common/Section";
import Footer from "./components/common/Footer";
import Admin from "./components/admin/admin";
import "@fortawesome/fontawesome-free/css/all.min.css";
// import User from "./components/user/UserNavebar";
// import RestaurantMenu from "./pages/user/RestaurantMenu";
import Restaurant from "./pages/user/Restaurant";
import UserOrders from "./pages/user/UserOrders";
import AdminOrders from "./pages/admin/AdminOrders";
import Cart from './pages/user/Cart';
import OurTeam from './components/common/OurTeam';
import Profile from "./pages/user/Profile";
import Menu from "./components/common/Menu";
import ScrollToTop from "./ScrollToTop";
const baseURL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const role = JSON.parse(localStorage.getItem("user"))?.role;
  const [restaurant, setRestaurant] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

   React.useEffect(() => {
          const fetchRestaurant = async () => {
            try {
              setLoading(true);
              const response = await axios.get(`${baseURL}/home`);
              // console.log("Api Response", response.data);
              if (Array.isArray(response.data)) {
                setRestaurant(response.data);
              } else {
                console.error("Unexpected data format:", response.data);
                setError("Invalid Restaurants Data Received");
              }
            } catch (error) {
              console.error(
                "Error fetching restaurant:",
                error.response?.data || error.message
              );
              setError(
                error.response?.data?.message || "Failed to fetch restaurant details"
              );
              toast.error("Failed to fetch restaurant details");
            } finally {
              setLoading(false);
            }
          };
          fetchRestaurant();
        }, []);
    
      
        const allItems = restaurant.flatMap(
          (res) =>
            res.menu?.flatMap(
              (section) =>
                section.items?.map((item) => ({
                  restaurantName: res.restaurantName,
                  section: section.section,
                  itemId: item._id,
                  name: item.name,
                  price: item.price,
                })) || []
            ) || []
        );
        // setAllItems(allItems);
        // console.log("All Items:", allItems); 

  // const [allItems, setAllItems] = React.useState([]);
  return (
    <>
    <ScrollToTop />
    {/* Pass setAllItems to Navbar and allItems to Content */}
    <Navbar  allItems={allItems} />
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/admin/:id/home" element={<Content restaurant={restaurant} />} />
      <Route path="/home" element={<Content restaurant={restaurant} />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/user/signup" element={<UserSignup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/:id/*" element={<Admin />} />
      <Route path="/user/:id/home" element={<Content restaurant={restaurant} />} />
      <Route path="/section/:section" element={<Section />} />
      <Route path="/user/:id/orders" element={<UserOrders />} />
      <Route path="/admin/orders/:id" element={<AdminOrders />} />
      <Route path="/user/:id/cart" element={<Cart />} />
      <Route  path="cart" element={<Cart />} />
      {/* <Route path="/user/:id/*" element={<User />}/> */}
      {/* <Route path="/restaurant/:name" element={<RestaurantMenu />}/> */}
      <Route path="/home/:name" element={<Restaurant />}/>
      <Route path="/user/:id/:name" element={<Restaurant />}/>
      <Route path="user/:id/profile" element={<Profile />} />  
      <Route path="/ourteam" element={<OurTeam/>}/>
      <Route path="/menu" element={<Menu />} />

    </Routes>
    <Footer />
    </>
  );
}
export default App;
