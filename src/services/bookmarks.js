const BOOKMARKS_KEY = 'gh-dashboard-bookmarks';

function normalizeRepository(repo) {
  return {
    id: repo.id,
    full_name: repo.full_name,
    description: repo.description,
  };
}

export function getBookmarkedRepositories() {
  try {
    const storedValue = localStorage.getItem(BOOKMARKS_KEY);
    if (!storedValue) {
      return [];
    }
    return JSON.parse(storedValue);
  } catch {
    return [];
  }
}

function saveBookmarks(bookmarks) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

export function toggleRepositoryBookmark(repo) {
  const normalizedRepo = normalizeRepository(repo);
  const current = getBookmarkedRepositories();
  const exists = current.some((item) => item.id === normalizedRepo.id);

  const next = exists
    ? current.filter((item) => item.id !== normalizedRepo.id)
    : [normalizedRepo, ...current];

  saveBookmarks(next);
  return next;
}
