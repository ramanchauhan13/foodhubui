import React from "react";
import spoon from "./assets/s&f.png";
import foodhub from "./assets/fh.png";

function FrontLoader() {
  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-up {
            animation: fadeInUp 1s ease-out forwards;
          }
        `}
      </style>

      <div className="h-screen w-screen text-lg md:text-xl flex text-white bg-orange-500 font-bold flex-col justify-center items-center">
        <div className="relative flex items-center justify-center w-[300px] h-[300px] overflow-hidden">
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

        {/* Animated Heading */}
        <h1 className="mt-6 text-center animate-fade-in-up">
          ORDER YOUR FAVOURITE FOOD FROM FOODHUB
        </h1>
      </div>
    </>
  );
}

export default FrontLoader;
