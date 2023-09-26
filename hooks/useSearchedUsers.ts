import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@prisma/client";
import useConversationModal from "./useConversationModal";

const useSearchedUsers = (searchQuery: string) => {
  const conversationModal = useConversationModal();

  const [debounceValue, setDebounceValue] = useState(searchQuery);

  const [results, setResults] = useState<User[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setDebounceValue(searchQuery);
    }, 3000);
  }, [searchQuery]);

  useEffect(() => {
    if (!conversationModal.isOpen) return;

    const getUsers = async () => {
      const res = await axios.get(
        `/api/search-users?searchQuery=${debounceValue}`
      );

      setResults(res.data);
    };

    getUsers();
  }, [debounceValue, conversationModal.isOpen]);

  return { results };
};

export default useSearchedUsers;
