import React, { useCallback, useEffect, useState } from "react";
import Button from "../Button";
import { AiOutlineClose } from "react-icons/ai";

interface Props {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  actionLabel: string;
  disabled?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
}: Props) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) return;

    setShowModal(false);

    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose]);

  const handleSubmit = useCallback(() => {
    if (disabled) return;

    onSubmit();
  }, [disabled, onSubmit]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-neutral-800/70 overflow-hidden"
        onClick={handleClose}
      />

      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-50 w-full md:w-4/6 lg:w-3/6 lg:max-w-3xl">
        <div
          className={`bg-black text-white w-full h-full sm:h-auto rounded-lg shadow-lg transition duration-300 ${
            showModal
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }
          `}
        >
          <div className="w-full h-full flex flex-col">
            <div className="flex items-center justify-between p-10">
              <h3 className="text-xl font-semibold">{title}</h3>

              <button
                className="p-1 ml-auto border-0  text-white hover:opacity-70 transition"
                onClick={handleClose}
              >
                <AiOutlineClose size={20} />
              </button>
            </div>

            <div className="relative p-10">{body}</div>

            <div className="flex flex-col gap-2 p-10">
              <Button
                label={actionLabel}
                disabled={disabled}
                onClick={handleSubmit}
                secondary
                fullWidth
                large
              />

              {footer}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
