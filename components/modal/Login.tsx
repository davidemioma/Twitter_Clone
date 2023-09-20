"use client";

import React, { useCallback, useState } from "react";
import Modal from "./Modal";
import Input from "../input/Input";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onToggle = useCallback(() => {
    if (loading) return;

    loginModal.onClose();

    registerModal.onOpen();
  }, [loading, loginModal, registerModal]);

  const onSubmit = async (values: loginData) => {
    setLoading(true);

    try {
      const callback = await signIn("credentials", {
        email: values.email,
        password: values.password,
      });

      if (callback?.ok) {
        toast.success("Login successful");

        loginModal.onClose();
      }

      if (callback?.error) {
        toast.error(callback.error);
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        id="email"
        type="email"
        placeholder="Email"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />

      <Input
        id="password"
        type="password"
        placeholder="Password"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="mt-4 text-neutral-400 text-center">
      <p>
        First time using twitter?{" "}
        <span
          className="text-white cursor-pointer hover:underline"
          onClick={onToggle}
        >
          Create an account
        </span>
      </p>
    </div>
  );

  return (
    <Modal
      isOpen={loginModal.isOpen}
      onClose={() => loginModal.onClose()}
      title="Login"
      actionLabel="Sign In"
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      disabled={loading}
      footer={footerContent}
    />
  );
};

export default Login;
