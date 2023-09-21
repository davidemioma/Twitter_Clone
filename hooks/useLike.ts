import { useEffect, useState } from "react";
import { PostProps } from "@/types";
import { User } from "@prisma/client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import useLoginModal from "./useLoginModal";
import { likePost, removeLike } from "@/app/actions/LikePost";

interface Props {
  currentUser: User | null;
  post: PostProps;
}

const useLike = ({ currentUser, post }: Props) => {
  const router = useRouter();

  const loginModal = useLoginModal();

  const [loading, setLoading] = useState(false);

  const [hasLiked, setHasLiked] = useState(
    post.likedIds.includes(currentUser?.id!)
  );

  const [likeCount, setLikeCount] = useState(post.likedIds.length);

  useEffect(() => {
    if (!currentUser) return;

    setHasLiked(post?.likedIds?.includes(currentUser.id));
  }, [post, currentUser]);

  useEffect(() => {
    setLikeCount(post?.likedIds?.length);
  }, [post]);

  const toggleLike = async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    setLoading(true);

    try {
      if (hasLiked) {
        setHasLiked(false);

        setLikeCount((prev) => prev - 1);

        await removeLike({ postId: post.id });

        router.refresh();
      } else {
        setHasLiked(true);

        setLikeCount((prev) => prev + 1);

        await likePost({ postId: post.id });

        router.refresh();
      }
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
