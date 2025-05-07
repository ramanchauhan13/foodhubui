import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Autoplay } from "swiper/modules";
import slide1 from "../../assets/slide1.jpg";
import slide2 from "../../assets/slide2.jpg";
import slide3 from "../../assets/slide3.jpg";
import slide4 from "../../assets/slide4.jpg";
import slide5 from "../../assets/slide5.jpg";
import { useNavigate, useParams } from "react-router-dom";
import image1 from "../../assets/restaurant1.jpg";
import Loader from "../../FrontLoader";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const PEXELS_API_KEY = "sSfQGKJtC1XMCCIBlUzPZd0hoSKEYaRpyYAmUSEVldfWmODXn9MSWzjL";

function Content({ restaurant = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sectionImages, setSectionImages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurant.length > 0) {
      setLoading(false);
    }
  }, [restaurant]);

  // Extracting all unique sections
  const allSections = restaurant.flatMap((restaurant) =>
    restaurant.menu ? restaurant.menu.map((section) => section.section) : []
  );
  const uniqueSections = [...new Set(allSections)];

  useEffect(() => {
    const updatedImages = {};
  
    // Load sectionImg from restaurant data
    restaurant.forEach((rest) => {
      rest.menu.forEach((menuItem) => {
        if (menuItem.section && menuItem.sectionImg) {
          updatedImages[menuItem.section] = menuItem.sectionImg;
        }
      });
    });
  
    setSectionImages(updatedImages);
  
    // OPTIONAL: Fetch from Pexels only if sectionImg is missing
    const fetchMissingImages = async () => {
      for (const section of uniqueSections) {
        if (!updatedImages[section]) {
          try {
            const response = await fetch(
              `https://api.pexels.com/v1/search?query=${section}&per_page=1`,
              {
                headers: {
                  Authorization: PEXELS_API_KEY,
                },
              }
            );
  
            const data = await response.json();
            if (data.photos && data.photos.length > 0) {
              const imgUrl = data.photos[0].src.medium;
              updatedImages[section] = imgUrl;
  
              // OPTIONAL: Save back to DB via API (write endpoint for this)
              await fetch(`${baseURL}/admin/sections/image`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ section, imageUrl: imgUrl }),
              });
            }
          } catch (error) {
            console.error(`Failed to fetch image for ${section}`, error);
          }
        }
      }
  
      setSectionImages({ ...updatedImages });
    };
  
    fetchMissingImages();
  }, [restaurant]);
  

  const handleViewMenu = (selectedRestaurant) => {
    const path = id
      ? `/user/${id}/${selectedRestaurant.restaurantName}`
      : `/home/${selectedRestaurant.restaurantName}`;
    navigate(path, { state: { restaurant: selectedRestaurant } });
  };

  const handleSectionClick = (section) => {
    const filteredRestaurants = restaurant.filter((restaurant) =>
      restaurant.menu.some((menuItem) => menuItem.section === section)
    );

    navigate(`/section/${section}`, {
      state: { section, restaurants: filteredRestaurants },
    });
  };

  const isSectionImagesLoading = uniqueSections.some(
    (section) => !sectionImages[section]
  );

  const renderSwiperSlides = (data, isRestaurant = true) => {
    return isRestaurant
      ? data.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="border-20 mx-5 my-5 h-[300px] text-center bg-white border-white transition-transform duration-300 ease-in-out transform hover:scale-110 shadow-lg relative overflow-hidden rounded-lg">
              <img
                src={image1}
                className="w-full h-full object-cover rounded-lg"
                alt={item.restaurantName}
              />
              <button
                className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white w-[50%] rounded-md shadow-lg opacity-90 hover:opacity-100 transition"
                onClick={() => handleViewMenu(item)}
              >
                Open Menu
              </button>
              <h1 className="absolute bottom-2 left-0 right-0 text-lg font-bold bg-orange-500 text-black py-3">
                {item.restaurantName || "Unnamed Restaurant"}
              </h1>
            </div>
          </SwiperSlide>
        ))
      : isSectionImagesLoading
      ? uniqueSections.map((_, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col items-center justify-center h-28 w-27 sm:h-60 sm:w-60 animate-pulse">
              <div className="w-[80%] h-[80%] rounded-full bg-gray-300 border-6 sm:border-10 border-white" />
              <div className="mt-2 w-[80%] h-4 bg-gray-300 rounded"></div>
            </div>
          </SwiperSlide>
        ))
      : data.map((item, index) => (
          <SwiperSlide key={index}>
            <div
              className="flex flex-col items-center justify-center h-28 w-27 sm:h-60 sm:w-60 cursor-pointer"
              onClick={() => handleSectionClick(item)}
            >
              <img
                src={sectionImages[item]}
                className="w-[80%] h-[80%] rounded-full object-cover border-6 sm:border-10 border-white hover:shadow-xl hover:scale-105 transition-transform duration-200 ease-in-out"
                alt={"Images are loading for: " + item}
              />
              <h1 className="mt-2 w-[80%] truncate whitespace-nowrap overflow-hidden text-sm sm:text-lg font-bold text-black text-center break-words">
                {item}
              </h1>
            </div>
          </SwiperSlide>
        ));
  };

  return (
    <>
      {loading ? (
        <div className="fixed top-0 left-0 w-full h-screen bg-white z-50 flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="bg-orange-500 w-full absolute mt-20 h-[30vh] sm:h-[70vh]"></div>

          <div className="border-10 sm:border-[30px] mx-5 sm:mx-15 my-6 relative border-white sm-rounded-2xl bg-white h-[30vh] sm:h-[65vh]">
            <Swiper
              modules={[Navigation, Autoplay]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 2000 }}
              loop={true}
              className="h-full w-full"
            >
              {[slide1, slide2, slide3, slide4, slide5].map((slide, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={slide}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover absolute"
                  />
                  <h1 className="text-white block bg-white/10 font-bold text-3xl sm:text-4xl relative text-center top-1/3">
                    FoodHub
                  </h1>
                  <h1 className="text-white bg-white/10 text-xl sm:text-2xl relative text-center top-1/3">
                    Your Favorite Food, Delivered Fast!
                  </h1>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="mx-0 sm:mx-15">
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={false}
              pagination={{ clickable: true }}
              autoplay={{ delay: 2000, pauseOnMouseEnter: true }}
              spaceBetween={1}
              slidesPerView={4}
              breakpoints={{
                320: { slidesPerView: 4, spaceBetween: 1 },
                768: { slidesPerView: 4, spaceBetween: 10 },
                1024: { slidesPerView: 5, spaceBetween: 30 },
              }}
              loop={true}
            >
              {renderSwiperSlides(uniqueSections, false)}
            </Swiper>
          </div>

          <div className="flex items-center justify-center mt-4 px-4 flex-wrap sm:flex-nowrap">
            <hr className="flex-grow border-2 border-gray-500 mx-4 sm:mx-20" />
            <span className="text-black text-2xl font-bold whitespace-nowrap">
              Favorite Restaurants
            </span>
            <hr className="flex-grow border-2 border-gray-500 mx-4 sm:mx-20" />
          </div>

          <div className="mx-0 sm:mx-15">
            <Swiper
              modules={[Navigation, Autoplay]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 2000, pauseOnMouseEnter: true }}
              spaceBetween={1}
              slidesPerView={4}
              breakpoints={{
                320: { slidesPerView: 3, spaceBetween: 1 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
              }}
              loop={true}
            >
              {restaurant.map((restaurant, index) => (
                <SwiperSlide key={index}>
                  <div
                    onClick={() => handleViewMenu(restaurant)}
                    className="border-8 sm:border-20 mx-2 sm:mx-5 my-5 h-[150px] sm:h-[300px] text-center bg-white border-white transition-transform duration-300 ease-in-out cursor-pointer transform hover:scale-110 shadow-lg relative overflow-hidden rounded-lg"
                  >
                    <img
                      src={restaurant.imageUrl || image1}
                      className="w-full h-full object-cover rounded-lg"
                      alt={restaurant.restaurantName}
                    />
                    <h1 className="absolute bottom-2 left-0 right-0 sm:text-lg text-md sm:font-bold font-semibold bg-orange-500 text-black sm:py-2">
                      {restaurant.restaurantName || "Unnamed Restaurant"}
                    </h1>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </>
      )}
    </>
  );
}

export default Content;
