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
import { registerData, registerSchema } from "@/lib/validators/register";
import { registerUser } from "@/app/actions/registerUser";

const Register = () => {
  const loginModal = useLoginModal();

  const registerModal = useRegisterModal();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
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

  const onToggle = useCallback(() => {
    if (loading) return;

    registerModal.onClose();

    loginModal.onOpen();
  }, [loading, registerModal, loginModal]);

  const onSubmit = async (values: registerData) => {
    setLoading(true);

    try {
      await registerUser({
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password,
      });

      toast.success("Account created");

      signIn("credentials", {
        email: values.email,
        password: values.password,
      });

      registerModal.onClose();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        id="name"
        type="text"
        placeholder="Name"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />

      <Input
        id="username"
        type="text"
        placeholder="Username"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />

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
        Already have an account?{" "}
        <span
          className="text-white cursor-pointer hover:underline"
          onClick={onToggle}
        >
          Sign in
        </span>
      </p>
    </div>
  );

  return (
    <Modal
      isOpen={registerModal.isOpen}
      onClose={() => registerModal.onClose()}
      title="Create an account"
      actionLabel="Register"
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      disabled={loading}
      footer={footerContent}
    />
  );
};

export default Register;
