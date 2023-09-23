import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import useLoginModal from "./useLoginModal";
import { followUser } from "@/app/actions/followUser";

interface Props {
  currentUser: User | null;
  profileUser: User | null;
}

const useFollow = ({ currentUser, profileUser }: Props) => {
  const router = useRouter();

  const loginModal = useLoginModal();

  const [loading, setLoading] = useState(false);

  const [isFollowing, setIsFollowing] = useState(
    currentUser?.followingsIds?.findIndex((id) => id === profileUser?.id) !== -1
  );

  useEffect(() => {
    if (!currentUser || !profileUser) return;

    setIsFollowing(
      currentUser.followingsIds?.findIndex((id) => id === profileUser.id) !== -1
    );
  }, [currentUser, profileUser]);

  const toggleFollow = async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    if (!profileUser || currentUser.id === profileUser?.id) {
      return;
    }

    setLoading(true);

    try {
      setTimeout(() => {
        setIsFollowing((prev) => !prev);
      }, 1000);

      await followUser({ profileUserId: profileUser?.id, isFollowing });

      router.refresh();
    } catch (err) {
      setIsFollowing(false);

      toast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return { loading, isFollowing, toggleFollow };
};

export default useFollow;
