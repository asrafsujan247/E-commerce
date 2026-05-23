import React from "react";

interface ErrorTwoProps {
  errors?: string[];
}

const ErrorTwo = ({ errors }: ErrorTwoProps) => {
  return (
    <ul>
      {errors?.map((error) => (
        <li key={error} className="text-red-400 text-sm mt-1">
          - {error}
        </li>
      ))}
    </ul>
  );
};

export default ErrorTwo;
