import { SkeletonLoader } from './SkeletonLoader.jsx';

export default function IssuesTab({
  activeTab,
  issueState,
  setIssueState,
  issuePage,
  setIssuePage,
  issues,
  isLoadingIssues,
  pageCount,
  formatDate,
}) {
  return (
    <div>
      <div className="toolbar">
        <label htmlFor="issue-state">Status:</label>
        <select
          id="issue-state"
          value={issueState}
          onChange={(event) => {
            setIssueState(event.target.value);
            setIssuePage(1);
          }}
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="all">All</option>
        </select>
      </div>

      {isLoadingIssues && <SkeletonLoader />}

      {!isLoadingIssues && issues.length === 0 && (
        <p className="status">No issues found for this filter.</p>
      )}

      {!isLoadingIssues && issues.length > 0 && (
        <ul className="issues-list">
          {issues.map((issue) => (
            <li key={issue.id} className="issue-item">
              <a href={issue.html_url} target="_blank" rel="noreferrer">
                {issue.title}
              </a>
              <div>
                <span>#{issue.number}</span>
                <span>{formatDate(issue.created_at)}</span>
                <span className={`state-pill ${issue.state}`}>
                  {issue.state}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="pagination-row">
        <button
          type="button"
          onClick={() => setIssuePage((prev) => Math.max(1, prev - 1))}
          disabled={issuePage === 1}
        >
          Previous
        </button>
        <span>
          Page {issuePage} of {pageCount}
        </span>
        <button
          type="button"
          onClick={() => setIssuePage((prev) => Math.min(pageCount, prev + 1))}
          disabled={issuePage >= pageCount}
        >
          Next
        </button>
      </div>
    </div>
  );
}
