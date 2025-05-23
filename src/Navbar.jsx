import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useClerk,
} from "@clerk/clerk-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useClerk();

  return (
    <nav className="shadow-md p-4">
      <div className="container flex justify-between items-center">
        <NavLink to="/" className="mx-12 text-xl font-bold text-gray-500">
          Shop with Adrienn
        </NavLink>

        {/* Burger Button */}
        <button
          className="md:hidden text-gray-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>

        {/* Navbar Links */}
        <div
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 shadow-md md:shadow-none transition-transform duration-300 ease-in-out ${
            isOpen
              ? "flex flex-col items-center space-y-4"
              : "hidden md:flex md:flex-row md:space-x-6"
          }`}
        >
          <NavLink
            to="/"
            className="block text-gray-400 hover:text-blue-500 px-3 py-2 text-center"
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>


          <NavLink
            to="/about"
            className="block text-gray-400 hover:text-blue-500 px-3 py-2 text-center"
            onClick={() => setIsOpen(false)}
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className="block text-gray-400 hover:text-blue-500 px-3 py-2 text-center"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </NavLink>

          <SignedIn>
            <NavLink
              to="/admin"
              className="block  text-gray-400 hover:text-blue-500 px-3 py-2 text-center"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </NavLink>
          </SignedIn>

          <SignedIn>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button
                className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={() => setIsOpen(false)}
              >
                Admin Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
