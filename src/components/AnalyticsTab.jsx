import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function AnalyticsTab({
  isLoadingAnalytics,
  issueActivity,
  contributors,
}) {
  return (
    <div className="analytics-grid">
      {isLoadingAnalytics && <p className="status">Loading analytics...</p>}

      {!isLoadingAnalytics && (
        <div className="chart-card">
          <h3>Opened issues (last 7 days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={issueActivity}>
              <defs>
                <linearGradient id="issueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.85} />
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="openedIssues"
                stroke="#115e59"
                fill="url(#issueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {!isLoadingAnalytics && (
        <div className="chart-card">
          <h3>Top contributors</h3>
          {contributors.length === 0 && (
            <p className="status">No data available.</p>
          )}
          {contributors.length > 0 && (
            <ol className="contributors-list">
              {contributors.map((contributor) => (
                <li key={contributor.id}>
                  <a
                    href={contributor.html_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {contributor.login}
                  </a>
                  <span>{contributor.contributions} commits</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
