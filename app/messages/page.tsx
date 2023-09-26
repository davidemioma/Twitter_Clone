import Header from "@/components/Header";
import { getCurrentUser } from "../actions/getCurrentUser";
import CreateBtn from "@/components/conversation/CreateBtn";
import { getConversations } from "../actions/getConversations";
import ConversationFeed from "@/components/conversation/ConversationFeed";
import EmptyConversation from "@/components/conversation/EmptyConversation";

export default async function Messages() {
  const currentUser = await getCurrentUser();

  const conversations = await getConversations();

  return (
    <div className="h-screen overflow-y-auto scrollbar-hide">
      <Header label="Messages" showBackArrow>
        <CreateBtn />
      </Header>

      {conversations.length > 0 ? (
        <ConversationFeed
          currentUser={currentUser}
          conversations={conversations}
        />
      ) : (
        <EmptyConversation />
      )}
    </div>
  );
}
