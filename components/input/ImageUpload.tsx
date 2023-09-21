import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { RxImage } from "react-icons/rx";
import { useDropzone } from "react-dropzone";

interface Props {
  value?: string;
  label?: string;
  disabled?: boolean;
  forPost?: boolean;
  onChange: (base64: string) => void;
}

const ImageUpload = ({ forPost, value, label, disabled, onChange }: Props) => {
  const [base64, setBase64] = useState(value);

  useEffect(() => {
    setBase64(value);
  }, [value]);

  const handleChange = useCallback(
    (base64: string) => {
      onChange(base64);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (files: any) => {
      const file = files[0];

      const reader = new FileReader();

      reader.onload = (e: any) => {
        setBase64(e.target.result);

        handleChange(e.target.result);
      };

      reader.readAsDataURL(file);
    },
    [handleChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: handleDrop,
    disabled,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/webp": [],
    },
  });

  return (
    <>
      {forPost ? (
        <div {...getRootProps()} className="cursor-pointer">
          <input {...getInputProps()} />

          {base64 ? (
            <Image width={70} height={70} src={base64} alt="upload" />
          ) : (
            <RxImage className="text-sky-500" size={20} />
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="w-full p-4 text-center rounded-md cursor-pointer border-2 border-dotted border-neutral-700"
        >
          <input {...getInputProps()} />

          {base64 ? (
            <div className="flex items-center justify-center">
              <Image width={100} height={100} src={base64} alt="upload" />
            </div>
          ) : (
            <p>{label}</p>
          )}
        </div>
      )}
    </>
  );
};

export default ImageUpload;
