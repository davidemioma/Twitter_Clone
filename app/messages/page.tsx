import Header from "@/components/Header";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../actions/getCurrentUser";
import { getConversations } from "../actions/getConversations";
import ConversationFeed from "@/components/conversation/ConversationFeed";
import EmptyConversation from "@/components/conversation/EmptyConversation";

export default async function Messages() {
  const currentUser = await getCurrentUser();

  const conversations = await getConversations();

  if (!currentUser) {
    redirect("/");
  }

  return (
    <div className="h-screen overflow-y-auto scrollbar-hide">
      <Header label="Messages" showBackArrow />

      {conversations.length > 0 ? (
        <ConversationFeed conversations={conversations} />
      ) : (
        <EmptyConversation />
      )}
    </div>
  );
}
