import { useState, useCallback } from "react";

type BookmarkType = "scheme" | "job";

const getKey = (type: BookmarkType) => `bookmarks_${type}`;

const load = (type: BookmarkType): string[] => {
  try {
    return JSON.parse(localStorage.getItem(getKey(type)) || "[]");
  } catch { return []; }
};

export const useBookmarks = () => {
  const [schemeIds, setSchemeIds] = useState<string[]>(() => load("scheme"));
  const [jobIds, setJobIds] = useState<string[]>(() => load("job"));

  const toggle = useCallback((type: BookmarkType, id: string) => {
    const setter = type === "scheme" ? setSchemeIds : setJobIds;
    setter((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(getKey(type), JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (type: BookmarkType, id: string) =>
      type === "scheme" ? schemeIds.includes(id) : jobIds.includes(id),
    [schemeIds, jobIds]
  );

  const totalCount = schemeIds.length + jobIds.length;

  return { toggle, isBookmarked, schemeIds, jobIds, totalCount };
};
