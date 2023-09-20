"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useLoginModal from "@/hooks/useLoginModal";
import { zodResolver } from "@hookform/resolvers/zod";
import useRegisterModal from "@/hooks/useRegisterModal";
import { registerData, registerSchema } from "@/lib/validators/register";

const Register = () => {
  const loginModal = useLoginModal();

  const registerModal = useRegisterModal();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: registerData) => {};

  return <div></div>;
};

export default Register;
