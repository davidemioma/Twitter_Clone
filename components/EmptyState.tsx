import React from "react";

interface Props {
  label: string;
}

const EmptyState = ({ label }: Props) => {
  return (
    <div className="p-6 text-xl text-center text-neutral-500">{label}!</div>
  );
};

export default EmptyState;
