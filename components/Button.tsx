import React from "react";

interface Props {
  label: string;
  secondary?: boolean;
  fullWidth?: boolean;
  large?: boolean;
  onClick: () => void;
  disabled?: boolean;
  outline?: boolean;
}

const Button = ({
  label,
  secondary,
  fullWidth,
  large,
  onClick,
  disabled,
  outline,
}: Props) => {
  return (
    <button
      className={`border-2 font-semibold rounded-full transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-70 ${
        fullWidth ? "w-full" : "w-fit"
      } ${
        secondary
          ? "bg-white text-black border-black"
          : "bg-sky-500 text-white border-sky-500"
      } ${large ? "text-base py-3 px-5" : "text-sm py-2 px-4"} ${
        outline ? "bg-transparent border-white text-white" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
