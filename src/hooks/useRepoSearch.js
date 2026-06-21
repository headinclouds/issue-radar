import { useEffect, useRef, useState } from 'react';
import { searchRepositories } from '../services/github.js';

export function useRepoSearch() {
  const skipNextSearchRef = useRef(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchError, setSearchError] = useState('');

  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const repos = await searchRepositories(query.trim(), controller.signal);
        setSuggestions(repos);
      } catch (searchError) {
        if (searchError.name === 'AbortError') {
          return;
        }
        setSearchError(searchError.message || 'Repository search failed.');
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  function selectRepositoryFromSearch(fullName) {
    skipNextSearchRef.current = true;
    setQuery(fullName);
    setSuggestions([]);
  }

  return {
    query,
    setQuery,
    setSuggestions,
    setIsSearching,
    isSearching,
    searchError,
    suggestions,
    selectRepositoryFromSearch,
  };
}
