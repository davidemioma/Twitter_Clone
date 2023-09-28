import qs from "query-string";
import { User } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import useActivelist from "./useActiveList";

interface Props {
  queryKey: string;
  conversationId: string;
  currentUser: User | null;
}

export const useChatQuery = ({
  queryKey,
  conversationId,
  currentUser,
}: Props) => {
  const { members } = useActivelist();

  const isActive = members.indexOf(currentUser?.email!) !== -1;

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: "/api/messages",
        query: {
          cursor: pageParam,
          conversationId,
        },
      },
      { skipNull: true }
    );

    const res = await fetch(url);

    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage: any) => lastPage?.nextCursor,
      refetchInterval: 1000,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
