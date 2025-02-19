import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-400">
          🚀 MyApp
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link to="/" className="hover:text-blue-400 transition duration-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-yellow-400 transition duration-300">
              About
            </Link>
          </li>
          <li>
            <Link to="/applications" className="hover:text-green-400 transition duration-300">
              Applications
            </Link>
          </li>
          <li>
            <Link to="/budget" className="hover:text-purple-400 transition duration-300">
              Budget
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden mt-4 space-y-2 text-center bg-gray-700 py-4 rounded-md">
          <li>
            <Link to="/" className="block py-2 hover:text-blue-400" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="block py-2 hover:text-yellow-400" onClick={() => setIsOpen(false)}>
              About
            </Link>
          </li>
          <li>
            <Link to="/applications" className="block py-2 hover:text-green-400" onClick={() => setIsOpen(false)}>
              Applications
            </Link>
          </li>
          <li>
            <Link to="/budget" className="block py-2 hover:text-purple-400" onClick={() => setIsOpen(false)}>
              Budget
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
