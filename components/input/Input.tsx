import { loginData } from "@/lib/validators/login";
import React from "react";
import { FieldValues, UseFormRegister, FieldErrors } from "react-hook-form";

interface Props {
  id: string;
  type?: string;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues | any>;
  errors: FieldErrors;
}

const Input = ({
  id,
  type,
  disabled,
  required,
  placeholder,
  register,
  errors,
}: Props) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <input
        className="w-full bg-black border-2 border-neutral-800 p-4 rounded-md outline-none focus:border-sky-500 disabled:bg-neutral-900 disabled:opacity-70 disabled:cursor-not-allowed transition"
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register(id, { required })}
      />

      {errors[id] && (
        <p className="text-sm text-red-500">
          {errors[id]?.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default Input;
