import { useEffect } from "react";
import { MessageProps } from "@/types";
import { pusherClient } from "@/lib/pusher";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  queryKey: string;
  pusherKey: string;
}

const useChatSocket = ({ queryKey, pusherKey }: Props) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);

    const newMessageHandler = (message: MessageProps) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                messages: [message],
              },
            ],
          };
        }

        const newData = [...oldData.pages];

        newData[0] = {
          ...newData[0],
          messages: [message, ...newData[0].messages],
        };

        return {
          ...oldData,
          pages: newData,
        };
      });
    };

    pusherClient.bind("message:new", newMessageHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);

      pusherClient.unbind("message:new", newMessageHandler);
    };
  }, [pusherKey, queryKey, queryClient]);
};

export default useChatSocket;
