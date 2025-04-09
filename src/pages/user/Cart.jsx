import React, { useState } from "react";
import Address from "./Address";
import PaymentInfo from "./PaymentInfo";
import Checkout from "./Checkout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Cart = () => {
  const [step, setStep] = useState(1);
  const [paymentDone, setPaymentDone] = useState(false);

  const nextStep = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const cart = JSON.parse(localStorage.getItem(`cart_${user.id}`));
    if (!cart || cart.length === 0) {
      toast.error("Add something to the cart before proceeding!");
      return;
    }
    setStep((prevStep) => (prevStep < 3 ? prevStep + 1 : prevStep));
  };

  const prevStep = () => {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };

  const confirmOrder = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const cart = JSON.parse(localStorage.getItem(`cart_${user.id}`));

      if (!cart || cart.length === 0) {
        toast.error("Cart is empty!");
        return;
      }

      const response = await axios.post(
        "https://foodhubapi-1.onrender.com/api/place-order",
        { cart },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      toast.success(response.data.message);
      localStorage.removeItem(`cart_${user.id}`);
      setStep(1);
    } catch (error) {
      toast.error("Failed to place order!");
      console.error(error);
    }
  };

  return (
    <>
      <div className="sm:mx-30 mx-0 sm:h-[90vh] bg-white flex flex-col sm:px-20 px-5 py-10 overflow-auto justify-between">
        <div>
          <div className="relative flex items-center justify-between w-full">
            <div className="absolute top-1/3 left-1/6 right-1/6 h-1 bg-gray-300 z-0"></div>
            <div className={`absolute top-1/3 left-1/6 h-1 ${step >= 2 ? "bg-orange-500" : "bg-gray-300"} w-1/3 z-0`}></div>
            <div className={`absolute top-1/3 left-1/2 h-1 ${step === 3 ? "bg-green-400" : "bg-gray-300"} w-1/3 z-0`}></div>
            <div className="relative z-10 flex flex-col items-center w-1/3">
              <div className={`w-12 h-12 text-gray-900 flex items-center justify-center text-lg font-extrabold rounded-full ${step >= 1 ? "bg-orange-500" : "bg-gray-300"}`}>
                1
              </div>
              <span className="mt-2 ">Checkout</span>
            </div>
            <div className="relative z-10 flex flex-col items-center w-1/3">
              <div className={`w-12 h-12 flex items-center justify-center text-lg font-extrabold rounded-full ${step >= 2 ? "bg-orange-500" : "bg-gray-300"}`}>
                2
              </div>
              <span className="mt-2">Address Info</span>
            </div>
            <div className="relative z-10 flex flex-col items-center w-1/3">
              <div className={`w-12 h-12 flex items-center justify-center text-lg font-extrabold rounded-full ${step === 3 ? "bg-green-400" : "bg-gray-300"}`}>
                3
              </div>
              <span className="mt-2">Payment Method</span>
            </div>
          </div>
          <div>
            {step === 1 && <Checkout />}
            {step === 2 && <Address />}
            {step === 3 && <PaymentInfo setPaymentDone={setPaymentDone} confirmOrder={confirmOrder} />}
          </div>
        </div>
        <div className="flex justify-between mb-3">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="px-6 py-2 bg-gray-400 text-white rounded-lg"
            >
              Previous
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg"
            >
              Proceed
            </button>
          ) : (
            <button
              onClick={confirmOrder}
              className={`px-6 py-2 text-white rounded-lg ${paymentDone ? "bg-green-500" : "bg-gray-400 cursor-not-allowed"}`}
              disabled={!paymentDone}
            >
              Confirm Order
            </button>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Cart;
