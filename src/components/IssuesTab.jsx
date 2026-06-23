import { SkeletonLoader } from "./SkeletonLoader.jsx";
import { Chip, Button } from "@heroui/react";
import { Select, Label, ListBox } from "@heroui/react";
import { Pagination } from "@heroui/react";
import { ISSUE_PAGE_SIZE } from "../App.jsx";
export default function IssuesTab({
  issueState,
  setIssueState,
  issuePage,
  setIssuePage,
  issues,
  issueTotalCount,
  isLoadingIssues,
  pageCount,
  formatDate,
}) {
  const startItem =
    issues.length === 0 ? 0 : (issuePage - 1) * ISSUE_PAGE_SIZE + 1;
  const endItem = issues.length === 0 ? 0 : startItem + issues.length - 1;

  return (
    <div>
      <div className="toolbar">
        <Select
          value={issueState}
          className="w-[256px]"
          placeholder="Select one"
          onChange={(event) => {
            setIssueState(event);
            setIssuePage(1);
          }}
        >
          <Label>Status:</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="open" textValue="Open">
                Open
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="closed" textValue="Closed">
                Closed
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="all" textValue="All">
                All
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>
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
                <Chip color={issue.state === "open" ? "success" : "danger"}>
                  {issue.state === "open" ? "Open" : "Closed"}
                </Chip>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Pagination className="w-full py-4 flex items-center justify-between">
        <Pagination.Summary>
          {startItem} to {endItem} of {issueTotalCount} issues
        </Pagination.Summary>
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous
              isDisabled={issuePage === 1}
              onPress={() => setIssuePage((p) => p - 1)}
            >
              <Pagination.PreviousIcon />
              <span>Prev</span>
            </Pagination.Previous>
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Next
              isDisabled={issuePage === pageCount}
              onPress={() => setIssuePage((p) => p + 1)}
            >
              <span>Next</span>
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  );
}
