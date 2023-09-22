import Form from "@/components/form/Form";
import Header from "@/components/Header";
import { getPosts } from "./actions/getPosts";
import { getCurrentUser } from "./actions/getCurrentUser";
import PostFeed from "@/components/post/PostFeed";

export default async function Home() {
  const currentUser = await getCurrentUser();

  const posts = await getPosts();

  return (
    <div className="h-screen overflow-y-auto scrollbar-hide">
      <Header label="Home" />

      <Form currentUser={currentUser} placeholder="What's happening?" />

      <PostFeed currentUser={currentUser} initialPosts={posts} />
    </div>
  );
}
