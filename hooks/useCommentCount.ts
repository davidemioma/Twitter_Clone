import { useEffect, useState } from "react";
import { getCommentsCount } from "@/app/actions/getCommentsCount";

const useCommentCount = (postId: string) => {
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const getCount = async () => {
      const count = await getCommentsCount(postId);

      setCommentCount(count);
    };

    getCount();
  }, [postId]);

  return { commentCount };
};

export default useCommentCount;
