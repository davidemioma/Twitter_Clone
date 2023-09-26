"use client";

import React from "react";
import Modal from "./Modal";
import Image from "next/image";
import useImageModal from "@/hooks/useImageModal";

const ImgModal = () => {
  const imageModal = useImageModal();

  const bodyContent = (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
      <Image className="object-cover" src={imageModal.image} fill alt="" />
    </div>
  );

  return (
    <Modal
      isOpen={imageModal.isOpen}
      onClose={() => imageModal.onClose()}
      body={bodyContent}
    />
  );
};

export default ImgModal;
