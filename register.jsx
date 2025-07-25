
import { Link } from "react-router-dom";
import registerAnimation from "../../assets/register_animation.json";
import Lottie from "lottie-react";

const REgister = () => {




  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-10">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Lottie Animation Section */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-6">
          <Lottie animationData={registerAnimation} className="w-full h-96" />
        </div>

        {/* Form Section */}
        <div className="p-6 md:p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-2">
            Create an Account
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Join us and start your journey!
          </p>

          <form onSubmit={''} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <input
              type="password"
              name="pass"
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?
            <Link
              to="/login"
              className="ml-1 text-indigo-600 hover:underline font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default REgister;