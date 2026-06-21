import { useEffect, useState } from 'react';
import { fetchRepoIssues } from '../services/github.js';
const ISSUE_PAGE_SIZE = 10;

export function useRepoIssues(selectedRepo) {
  const [issueState, setIssueState] = useState('open');
  const [issuePage, setIssuePage] = useState(1);
  const [issues, setIssues] = useState([]);
  const [issueTotalCount, setIssueTotalCount] = useState(0);
  const [isLoadingIssues, setIsLoadingIssues] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedRepo) {
      return;
    }

    const loadIssues = async () => {
      try {
        setIsLoadingIssues(true);
        setError('');
        const { items, totalCount } = await fetchRepoIssues({
          fullName: selectedRepo.full_name,
          state: issueState,
          page: issuePage,
          perPage: ISSUE_PAGE_SIZE,
        });
        setIssues(items);
        setIssueTotalCount(totalCount);
      } catch (issuesError) {
        setError(issuesError.message || 'Failed to load issues.');
      } finally {
        setIsLoadingIssues(false);
      }
    };

    loadIssues();
  }, [selectedRepo, issueState, issuePage]);
  return {
    issueState,
    setIssueState,
    issuePage,
    setIssuePage,
    issues,
    issueTotalCount,
    isLoadingIssues,
    error,
  };
}
