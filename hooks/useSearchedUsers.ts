import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@prisma/client";

const useSearchedUsers = (searchQuery: string) => {
  const [debounceValue, setDebounceValue] = useState(searchQuery);

  const [results, setResults] = useState<User[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setDebounceValue(searchQuery);
    }, 3000);
  }, [searchQuery]);

  useEffect(() => {
    const getUsers = async () => {
      const res = await axios.get(
        `/api/search-users?searchQuery=${debounceValue}`
      );

      setResults(res.data);
    };

    getUsers();
  }, [debounceValue]);

  return { results };
};

export default useSearchedUsers;
