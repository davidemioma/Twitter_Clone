import Header from "@/components/Header";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../actions/getCurrentUser";
import { getNotifications } from "../actions/getNotifications";
import NotificationsContent from "@/components/notification/NotificationsContent";

export const dynamic = "force-dynamic";

export default async function Notifications() {
  const currentUser = await getCurrentUser();

  const notifications = await getNotifications();

  return (
    <div className="h-screen overflow-y-auto scrollbar-hide">
      <Header label="Notifications" showBackArrow />

      <NotificationsContent
        currentUser={currentUser}
        notifications={notifications}
      />
    </div>
  );
}
