import React from "react";

interface ErrorProps {
  errorMessage?: { message?: string };
  errorName?: string;
}

const Error = ({ errorMessage, errorName }: ErrorProps) => {
  return (
    <>
      <span className="text-red-400 text-sm mt-2">
        {errorName || errorMessage?.message}
      </span>
    </>
  );
};

export default Error;
