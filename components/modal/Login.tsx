"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useLoginModal from "@/hooks/useLoginModal";
import { zodResolver } from "@hookform/resolvers/zod";
import useRegisterModal from "@/hooks/useRegisterModal";
import { loginData, loginSchema } from "@/lib/validators/login";

const Login = () => {
  const loginModal = useLoginModal();

  const registerModal = useRegisterModal();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: loginData) => {};

  return <div></div>;
};

export default Login;
