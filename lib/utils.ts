import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict } from "date-fns";
import locale from "date-fns/locale/en-US";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatDistanceLocale = {
  lessThanXSeconds: "just now",
  xSeconds: "just now",
  halfAMinute: "just now",
  lessThanXMinutes: "{{count}}m",
  xMinutes: "{{count}}m",
  aboutXHours: "{{count}}h",
  xHours: "{{count}}h",
  xDays: "{{count}}d",
  aboutXWeeks: "{{count}}w",
  xWeeks: "{{count}}w",
  aboutXMonths: "{{count}}m",
  xMonths: "{{count}}m",
  aboutXYears: "{{count}}y",
  xYears: "{{count}}y",
  overXYears: "{{count}}y",
  almostXYears: "{{count}}y",
};

function formatDistance(token: string, count: number, options?: any): string {
  options = options || {};

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace("{{count}}", count.toString());

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return "in " + result;
    } else {
      if (result === "just now") return result;
      return result + " ago";
    }
  }

  return result;
}

export function formatTimeToNow(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  });
}

export const INFINITE_SCROLL_PAGINATION_RESULTS = 20;

export const numberFormatter = (num: number) => {
  let newNumber = "";

  if (num >= 1000000000) {
    newNumber = (num / 1000000000).toFixed(1) + "B";
  } else if (num >= 1000000) {
    newNumber = (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    newNumber = (num / 1000).toFixed(1) + "K";
  } else {
    newNumber = `${num}`;
  }

  return newNumber;
};

export const getRandomUsers = (users: any[], numOfUsers: number) => {
  if (numOfUsers > users.length) {
    return users.slice(0, users.length);
  }

  const randomUsers = [];

  const usersCopy = [...users];

  while (randomUsers.length < numOfUsers) {
    const randomIndex = Math.floor(Math.random() * usersCopy.length);

    const randomUser = usersCopy.splice(randomIndex, 1)[0];

    randomUsers.push(randomUser);
  }

  return randomUsers;
};
