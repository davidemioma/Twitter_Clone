import Header from "@/components/Header";
import Form from "@/components/form/Form";
import { redirect } from "next/navigation";
import PostItem from "@/components/post/PostItem";
import CommentFeed from "@/components/CommentFeed";
import { getPostById } from "@/app/actions/getPostById";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getCommentByPostId } from "@/app/actions/getCommentByPostId";

export default async function Post({ params }: { params: { id: string } }) {
  const { id } = params;

  const post = await getPostById(id);

  const currentUser = await getCurrentUser();

  const comments = await getCommentByPostId(id);

  if (!post) {
    return redirect("/");
  }

  return (
    <div className="h-screen overflow-y-auto scrollbar-hide">
      <Header label="Tweet" showBackArrow />

      <PostItem currentUser={currentUser} post={post} />

      <Form
        currentUser={currentUser}
        placeholder="Tweet your reply"
        isComment
        postId={post.id}
      />

      <CommentFeed
        currentUser={currentUser}
        postId={id}
        initialComments={comments}
      />
    </div>
  );
}
