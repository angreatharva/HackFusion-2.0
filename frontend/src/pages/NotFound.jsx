import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-red-400">404 - Page Not Found</h1>
      <p className="text-gray-300 mt-4">Oops! The page you are looking for doesn't exist.</p>
      <Link to="/" className="text-blue-400 mt-4 inline-block hover:underline">
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
