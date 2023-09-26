import Header from "@/components/Header";
import { redirect } from "next/navigation";
import MessageForm from "@/components/message/MessageForm";
import MessagesBody from "@/components/message/MessagesBody";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getConversationById } from "@/app/actions/getConversationById";

export default async function Conversation({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const currentUser = await getCurrentUser();

  const conversation = await getConversationById(id);

  if (!conversation) {
    return redirect("/messages");
  }

  const otherUser =
    conversation?.memberOneId === currentUser?.id
      ? conversation?.memberTwo
      : conversation?.memberOne;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header label={otherUser?.name || ""} showBackArrow />

      <MessagesBody
        currentUser={currentUser}
        conversationId={conversation.id}
      />

      <MessageForm conversationId={conversation.id} />
    </div>
  );
}
