import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <AlertTriangle className="w-16 h-16 text-warning mb-4" />
      <h1 className="text-3xl font-bold mb-2">Page Under Construction</h1>
      <p className="text-lg mb-6 text-base-content/80">
        Oops! This page is not yet ready. We're working hard to bring it to you soon.<br />
        Please check back later or return to the homepage.
      </p>
      <Link to="/" className="btn btn-primary">Go to Home</Link>
    </div>
  );
};

export default NotFound;
