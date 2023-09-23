import Header from "@/components/Header";
import { redirect } from "next/navigation";
import EmptyState from "@/components/EmptyState";
import UserCard from "@/components/user/UserCard";
import FollowBar from "@/components/user/FollowBar";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getProfileUser } from "@/app/actions/getProfileUser";

export default async function Followers({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const currentUser = await getCurrentUser();

  const profileUser = await getProfileUser(id);

  if (!profileUser) {
    return redirect("/");
  }

  return (
    <div className="h-screen overflow-y-auto scrollbar-hide">
      <Header label={profileUser?.name as string} showBackArrow />

      <FollowBar profileUser={profileUser} />

      <>
        {profileUser?.followersIds?.length > 0 ? (
          <>
            {profileUser?.followersIds?.map((id) => (
              <div key={id}>
                {/* @ts-ignore */}
                <UserCard currentUser={currentUser} userId={id} />
              </div>
            ))}
          </>
        ) : (
          <EmptyState label="You have no followers" />
        )}
      </>
    </div>
  );
}
