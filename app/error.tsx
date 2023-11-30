"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
    // You might want to send the error to an error tracking service here
  }, [error]);

  return (
    <div className="flex justify-center items-center p-[100px]">
      <div className="text-dark text-center">
        <span className="text-7xl font-semibold text-primary">500</span>
        <h2 className="p-4 text-3xl">Oops! Something went wrong.</h2>
        <p className="mb-6 text-lg text-gray-600">
          We're sorry, but there was an error processing your request.
        </p>
        <button
          className="uppercase tracking-[1px] px-5 py-2.5 mt-1 border-2 border-primary transition-all ease-in-out duration-100 hover:bg-primary text-dark hover:text-white font-semibold text-lg"
          onClick={reset}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
