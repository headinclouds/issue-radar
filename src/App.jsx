import { useEffect, useMemo, useState } from 'react';

import {
  fetchIssueActivity,
  fetchRepoContributors,
} from './services/github.js';
import {
  getBookmarkedRepositories,
  toggleRepositoryBookmark,
} from './services/bookmarks.js';

import SearchPanel from './components/SearchPanel.jsx';
import BookmarksPanel from './components/BookmarksPanel.jsx';
import IssuesTab from './components/IssuesTab.jsx';
import AnalyticsTab from './components/AnalyticsTab.jsx';
import RepoHeader from './components/RepoHeader.jsx';
import { useRepoSearch } from './hooks/useRepoSearch.js';
import { useRepoIssues } from './hooks/useRepoIssues.js';

const ISSUE_PAGE_SIZE = 10;

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

function App() {
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [bookmarks, setBookmarks] = useState(getBookmarkedRepositories());

  const [activeTab, setActiveTab] = useState('issues');

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

  const [contributors, setContributors] = useState([]);
  const [issueActivity, setIssueActivity] = useState([]);

  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');
  const {
    query,
    setQuery,
    isSearching,
    searchError,
    suggestions,
    selectRepositoryFromSearch,
  } = useRepoSearch();

  useEffect(() => {
    if (!selectedRepo || activeTab !== 'analytics') {
      return;
    }

    const loadAnalytics = async () => {
      try {
        setIsLoadingAnalytics(true);
        setAnalyticsError('');
        const [activity, topContributors] = await Promise.all([
          fetchIssueActivity(selectedRepo.full_name),
          fetchRepoContributors(selectedRepo.full_name),
        ]);
        setIssueActivity(activity);
        setContributors(topContributors);
      } catch (analyticsError) {
        setAnalyticsError(
          analyticsError instanceof Error
            ? analyticsError.message
            : 'Failed to load analytics.'
        );
      } finally {
        setIsLoadingAnalytics(false);
      }
    };

    loadAnalytics();
  }, [selectedRepo, activeTab]);

  const isBookmarked = useMemo(() => {
    if (!selectedRepo) {
      return false;
    }
    return bookmarks.some((repo) => repo.id === selectedRepo.id);
  }, [selectedRepo, bookmarks]);

  const error =
    activeTab === 'analytics'
      ? analyticsError || searchError
      : issuesError || searchError;

  const pageCount = Math.max(1, Math.ceil(issueTotalCount / ISSUE_PAGE_SIZE));

  function handleSelectRepository(repo) {
    setSelectedRepo(repo);
    selectRepositoryFromSearch(repo.full_name);
    setIssuePage(1);
    setActiveTab('issues');
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
            <button
              type="button"
              className={activeTab === 'issues' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('issues')}
            >
              Issues
            </button>
            <button
              type="button"
              className={activeTab === 'analytics' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          </div>

          {activeTab === 'issues' && (
            <IssuesTab
              activeTab={activeTab}
              issueState={issueState}
              setIssueState={setIssueState}
              issuePage={issuePage}
              setIssuePage={setIssuePage}
              issues={issues}
              isLoadingIssues={isLoadingIssues}
              pageCount={pageCount}
              formatDate={formatDate}
            />
          )}

          {activeTab === 'analytics' && (
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
