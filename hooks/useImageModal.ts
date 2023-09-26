import { create } from "zustand";

interface Props {
  isOpen: boolean;
  image: string;
  onOpen: (image: string) => void;
  onClose: () => void;
}

const useImageModal = create<Props>((set) => ({
  isOpen: false,
  image: "",
  onOpen: (image) => set({ isOpen: true, image }),
  onClose: () => set({ isOpen: false, image: "" }),
}));

export default useImageModal;
