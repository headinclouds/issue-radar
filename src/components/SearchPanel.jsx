import { SkeletonLoader } from './SkeletonLoader.jsx';
export default function SearchPanel({
  query,
  setQuery,
  suggestions,
  isSearching,
  handleSelectRepository,
}) {
  return (
    <section className="card search-card">
      <label htmlFor="repo-search">Repository search</label>
      <input
        id="repo-search"
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Try: facebook/react"
      />
      {isSearching && <SkeletonLoader />}

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((repo) => (
            <li key={repo.id}>
              <button
                type="button"
                onClick={() => handleSelectRepository(repo)}
              >
                <span className="repo-name">{repo.full_name}</span>
                <span className="repo-meta">
                  {repo.stargazers_count.toLocaleString()} stars
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
