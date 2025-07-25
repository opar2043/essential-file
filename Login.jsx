import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import login_animation from "../../assets/login_animation.json";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-10">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-10">
        
        {/* Lottie Animation */}
        <div className="flex items-center justify-center">
          <Lottie 
            animationData={login_animation} 
            loop={true}
            className="w-full h-80 md:h-[400px]" 
          />
        </div>

        {/* Form Section */}
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md transition"
            >
              Sign In
            </button>

            {/* Optional Google login button */}
            
            <button
              type="button"
              onClick={'handleGoogleLogin'}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 py-3 rounded-md transition"
            >
              <FaGoogle className="text-blue-500" /> Continue with Google
            </button> 
           
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Link to="/register" className="text-green-600 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
