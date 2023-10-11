import { useEffect, useState } from "react";
import axios from "axios";
import { PostProps } from "@/types";
import { User } from "@prisma/client";
import { toast } from "react-hot-toast";
import useLoginModal from "./useLoginModal";

interface Props {
  currentUser: User | null;
  post: PostProps;
}

const useLike = ({ currentUser, post }: Props) => {
  const loginModal = useLoginModal();

  const [likeCount, setLikeCount] = useState(post.likedIds.length);

  const [hasLiked, setHasLiked] = useState(
    currentUser?.likedPostIds.findIndex((id) => id === post.id) !== -1
  );

  useEffect(() => {
    if (!post) return;

    setLikeCount(post.likedIds.length);
  }, [post]);

  useEffect(() => {
    if (!currentUser) return;

    setHasLiked(
      currentUser.likedPostIds.findIndex((id) => id === post.id) !== -1
    );
  }, [post, currentUser]);

  const toggleLike = async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    setHasLiked((prev) => !prev);

    setLikeCount((prev) => (hasLiked ? prev - 1 : prev + 1));

    try {
      await axios.post("/api/like", { postId: post.id, hasLiked });
    } catch (err) {
      toast.error("Something went wrong. Try again!");
    }
  };

  return {
    hasLiked,
    likeCount,
    toggleLike,
  };
};

export default useLike;
