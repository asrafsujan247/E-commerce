import React from "react";

interface LabelProps {
  label?: string;
}

const Label = ({ label }: LabelProps) => {
  return (
    <label className="block text-muted-foreground font-medium text-sm leading-none mb-2">
      {label}
    </label>
  );
};

export default Label;
