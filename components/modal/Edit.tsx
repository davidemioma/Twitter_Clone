"use client";

import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Input from "../input/Input";
import { User } from "@prisma/client";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import ImageUpload from "../input/ImageUpload";
import EmojiPicker from "../input/EmojiPicker";
import useEditModal from "@/hooks/useEditModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { editData, editSchema } from "@/lib/validators/edit";
import { updateAccount } from "@/app/actions/updateAccount";

interface Props {
  currentUser: User | null;
}

const Edit = ({ currentUser }: Props) => {
  const router = useRouter();

  const editModal = useEditModal();

  const [loading, setLoading] = useState(false);

  const [coverImage, setCoverImage] = useState("");

  const [profileImage, setProfileImage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: "",
      username: "",
      bio: "",
    },
  });

  useEffect(() => {
    setValue("name", currentUser?.name || "");

    setValue("username", currentUser?.username || "");

    setValue("bio", currentUser?.bio || "");

    setCoverImage(currentUser?.coverImage!);

    setProfileImage(currentUser?.profileImage!);
  }, [currentUser]);

  const addEmoji = (emoji: any) => {
    const currentValue = getValues("bio");

    const updatedValue = `${currentValue} ${emoji}`;

    setValue("bio", updatedValue);
  };

  const onSubmit = async (values: editData) => {
    setLoading(true);

    try {
      await updateAccount({
        name: values.name,
        username: values.username,
        bio: values.bio,
        coverImage,
        profileImage,
      });

      toast.success("Account Updated");

      router.refresh();

      editModal.onClose();
    } catch (err) {
      toast.error("Something went wrong. Try again!");
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

      <div className="flex items-center gap-5">
        <Input
          id="bio"
          type="text"
          placeholder="Bio"
          disabled={loading}
          register={register}
          errors={errors}
          required
        />

        <EmojiPicker onChange={(emoji) => addEmoji(emoji)} />
      </div>

      <ImageUpload
        label="Upload profile image"
        value={coverImage}
        disabled={loading}
        onChange={(image) => setCoverImage(image)}
      />

      <ImageUpload
        label="Upload profile image"
        value={profileImage}
        disabled={loading}
        onChange={(image) => setProfileImage(image)}
      />
    </div>
  );

  return (
    <Modal
      title="Edit profile"
      isOpen={editModal.isOpen}
      onClose={() => editModal.onClose()}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel="Save"
      disabled={loading}
      body={bodyContent}
    />
  );
};

export default Edit;
