import Header from "@/components/Header";
import { redirect } from "next/navigation";
import UserBio from "@/components/user/UserBio";
import UserHero from "@/components/user/UserHero";
import PostItem from "@/components/post/PostItem";
import EmptyState from "@/components/EmptyState";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getProfileUser } from "@/app/actions/getProfileUser";
import { getPostsByUserId } from "@/app/actions/getPostsByUserId";

export default async function User({ params }: { params: { id: string } }) {
  const { id } = params;

  const currentUser = await getCurrentUser();

  const profileUser = await getProfileUser(id);

  const posts = await getPostsByUserId(id);

  if (!profileUser) {
    return redirect("/");
  }

  return (
    <div className="h-screen overflow-y-auto scrollbar-hide">
      <Header label={profileUser?.name as string} showBackArrow />

      <UserHero user={profileUser} />

      <UserBio currentUser={currentUser} profileUser={profileUser} />

      {posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <PostItem key={post.id} currentUser={currentUser} post={post} />
          ))}
        </>
      ) : (
        <EmptyState label="No posts available" />
      )}
    </div>
  );
}
