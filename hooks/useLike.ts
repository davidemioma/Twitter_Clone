import { useEffect, useState } from "react";
import { PostProps } from "@/types";
import { User } from "@prisma/client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import useLoginModal from "./useLoginModal";
import { likePost } from "@/app/actions/LikePost";

interface Props {
  currentUser: User | null;
  post: PostProps;
}

const useLike = ({ currentUser, post }: Props) => {
  const router = useRouter();

  const loginModal = useLoginModal();

  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      setHasLiked((prev) => !prev);

      setLikeCount((prev) => (hasLiked ? prev - 1 : prev + 1));

      await likePost({ postId: post.id, hasLiked });

      router.refresh();
    } catch (err) {
      setHasLiked(false);

      toast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return {
    hasLiked,
    likeCount,
    loading,
    toggleLike,
  };
};

export default useLike;
