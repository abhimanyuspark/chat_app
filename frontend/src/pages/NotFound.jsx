import React from "react";
import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-9xl font-bold text-error">404</h1>
      <p className="text-2xl mt-4">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary mt-6">
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
