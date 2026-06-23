import { useEffect, useState } from "react";
import {
  fetchIssueActivity,
  fetchRepoContributors,
} from "../services/github.js";

export function useRepoAnalytics(selectedRepo, activeTab) {
  const [contributors, setContributors] = useState([]);
  const [issueActivity, setIssueActivity] = useState([]);

  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [analyticsError, setAnalyticsError] = useState("");
  useEffect(() => {
    if (!selectedRepo || activeTab !== "analytics") {
      return;
    }

    const loadAnalytics = async () => {
      try {
        setIsLoadingAnalytics(true);
        setAnalyticsError("");
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
            : "Failed to load analytics.",
        );
      } finally {
        setIsLoadingAnalytics(false);
      }
    };

    loadAnalytics();
  }, [selectedRepo, activeTab]);

  return { isLoadingAnalytics, issueActivity, contributors, analyticsError };
}
