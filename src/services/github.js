const GITHUB_API_BASE = 'https://api.github.com';

async function request(url, signal) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status}`);
  }

  return response.json();
}

export async function searchRepositories(query, signal) {
  const encodedQuery = encodeURIComponent(query);
  const data = await request(
    `${GITHUB_API_BASE}/search/repositories?q=${encodedQuery}&sort=stars&order=desc&per_page=7`,
    signal
  );

  return data.items ?? [];
}

export async function fetchRepoIssues({ fullName, state, page, perPage }) {
  const encodedName = encodeURIComponent(fullName);
  const encodedState = encodeURIComponent(state);

  const data = await request(
    `${GITHUB_API_BASE}/search/issues?q=repo:${encodedName}+is:issue+state:${encodedState}&sort=created&order=desc&per_page=${perPage}&page=${page}`
  );

  return {
    items: (data.items ?? []).filter((item) => !item.pull_request),
    totalCount: Math.min(data.total_count ?? 0, 1000),
  };
}

export async function fetchRepoContributors(fullName) {
  const data = await request(
    `${GITHUB_API_BASE}/repos/${fullName}/contributors?per_page=5`
  );

  return data.slice(0, 5);
}

export async function fetchIssueActivity(fullName) {
  const data = await request(
    `${GITHUB_API_BASE}/repos/${fullName}/issues?state=all&per_page=100&sort=created&direction=desc`
  );
  console.log('Fetched issues for activity:', data);
  const sevenDays = [];
  const now = new Date();

  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = new Date(now);
    day.setDate(now.getDate() - offset);
    const key = day.toISOString().slice(0, 10);
    sevenDays.push({
      key,
      date: day.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
      openedIssues: 0,
    });
  }
  console.log('Initialized 7-day activity map:', sevenDays);
  const map = new Map(sevenDays.map((item) => [item.key, item]));

  (data ?? [])
    .filter((item) => !item.pull_request)
    .forEach((issueItem) => {
      const createdAt = issueItem?.created_at;
      if (!createdAt) {
        return;
      }
      const createdDay = createdAt.slice(0, 10);
      if (map.has(createdDay)) {
        map.get(createdDay).openedIssues += 1;
      }
    });

  return sevenDays.map(({ key, ...rest }) => rest);
}
