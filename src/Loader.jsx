import React from "react";
import spoon from "./assets/Spoon and forks.png";
import foodhub from "./assets/FoodHub.png";

function Loader() {
  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center">
    <div className="relative flex items-center justify-center w-[300px] h-[300px] mb-50  overflow-hidden">
      {/* Rotating Spoon & Forks */}
      <img
        src={spoon}
        alt="Rotating Spoons and Forks"
        className="absolute w-full h-full animate-spin"
        style={{ animationDuration: "3s" }}
      />
      
      {/* Static FoodHub Logo */}
      <img
        src={foodhub}
        alt="Static FoodHub Logo"
        className="absolute w-[80%] h-[80%]"
      />
    </div>
    </div>
  );
}

export default Loader;
