import { useMemo, useState } from "react";
import { Button } from "@heroui/react";
import {
  getBookmarkedRepositories,
  toggleRepositoryBookmark,
} from "./services/bookmarks.js";

import SearchPanel from "./components/SearchPanel.jsx";
import BookmarksPanel from "./components/BookmarksPanel.jsx";
import IssuesTab from "./components/IssuesTab.jsx";
import AnalyticsTab from "./components/AnalyticsTab.jsx";
import RepoHeader from "./components/RepoHeader.jsx";
import { useRepoSearch } from "./hooks/useRepoSearch.js";
import { useRepoIssues } from "./hooks/useRepoIssues.js";
import { useRepoAnalytics } from "./hooks/useRepoAnalytics.js";

export const ISSUE_PAGE_SIZE = 10;

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

function App() {
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [bookmarks, setBookmarks] = useState(getBookmarkedRepositories());

  const [activeTab, setActiveTab] = useState("issues");

  const {
    issueState,
    setIssueState,
    issuePage,
    setIssuePage,
    issues,
    issueTotalCount,
    isLoadingIssues,
    error: issuesError,
  } = useRepoIssues(selectedRepo);

  const {
    query,
    setQuery,
    isSearching,
    searchError,
    suggestions,
    selectRepositoryFromSearch,
  } = useRepoSearch();

  const { isLoadingAnalytics, issueActivity, contributors, analyticsError } =
    useRepoAnalytics(selectedRepo, activeTab);

  const isBookmarked = useMemo(() => {
    if (!selectedRepo) {
      return false;
    }
    return bookmarks.some((repo) => repo.id === selectedRepo.id);
  }, [selectedRepo, bookmarks]);

  const error =
    activeTab === "analytics"
      ? analyticsError || searchError
      : issuesError || searchError;

  const pageCount = Math.max(1, Math.ceil(issueTotalCount / ISSUE_PAGE_SIZE));

  function handleSelectRepository(repo) {
    setSelectedRepo(repo);
    selectRepositoryFromSearch(repo.full_name);
    setIssuePage(1);
    setActiveTab("issues");
  }

  function handleToggleBookmark() {
    if (!selectedRepo) {
      return;
    }
    const updatedBookmarks = toggleRepositoryBookmark(selectedRepo);
    setBookmarks(updatedBookmarks);
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">IssueRadar</p>
        <h1>Find repositories and monitor issues in one place</h1>
        <p className="subtitle">
          Search with autocomplete, browse paginated issues, inspect 7-day issue
          activity, and keep favorite repositories at hand.
        </p>
      </section>

      <SearchPanel
        query={query}
        setQuery={setQuery}
        suggestions={suggestions}
        isSearching={isSearching}
        handleSelectRepository={handleSelectRepository}
      />

      <BookmarksPanel
        bookmarks={bookmarks}
        handleSelectRepository={handleSelectRepository}
      />

      {selectedRepo && (
        <section className="card details-card">
          <RepoHeader
            selectedRepo={selectedRepo}
            isBookmarked={isBookmarked}
            handleToggleBookmark={handleToggleBookmark}
          />

          <div className="tabs-row">
            <Button
              type="button"
              {...(activeTab === "issues" ? {} : { variant: "secondary" })}
              onClick={() => setActiveTab("issues")}
            >
              Issues
            </Button>
            <Button
              type="button"
              {...(activeTab === "analytics" ? {} : { variant: "secondary" })}
              onClick={() => setActiveTab("analytics")}
            >
              Analytics
            </Button>
          </div>

          {activeTab === "issues" && (
            <IssuesTab
              issueState={issueState}
              setIssueState={setIssueState}
              issuePage={issuePage}
              setIssuePage={setIssuePage}
              issues={issues}
              issueTotalCount={issueTotalCount}
              isLoadingIssues={isLoadingIssues}
              pageCount={pageCount}
              formatDate={formatDate}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsTab
              isLoadingAnalytics={isLoadingAnalytics}
              issueActivity={issueActivity}
              contributors={contributors}
            />
          )}
        </section>
      )}

      {error && <p className="error-box">{error}</p>}
    </main>
  );
}

export default App;
