import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

interface Props {
  queryKey: string;
  conversationId: string;
}

export const useChatQuery = ({ queryKey, conversationId }: Props) => {
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
      refetchInterval: false,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
