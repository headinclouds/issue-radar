export default function BookmarksPanel({ bookmarks, handleSelectRepository }) {
  return (
    <section className="card bookmarks-card">
      <div className="section-title-row">
        <h2>Bookmarks</h2>
        <span>{bookmarks.length}</span>
      </div>
      {bookmarks.length === 0 && (
        <p className="status">No bookmarks yet. Select a repository first.</p>
      )}
      {bookmarks.length > 0 && (
        <ul className="bookmarks-list">
          {bookmarks.map((repo) => (
            <li key={repo.id}>
              <button
                type="button"
                onClick={() => handleSelectRepository(repo)}
              >
                {repo.full_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
