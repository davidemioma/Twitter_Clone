import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { getSearchedUsers } from "@/app/actions/getSearchedUsers";

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
      const results = await getSearchedUsers(debounceValue);

      setResults(results);
    };

    getUsers();
  }, [debounceValue]);

  return { results };
};

export default useSearchedUsers;
