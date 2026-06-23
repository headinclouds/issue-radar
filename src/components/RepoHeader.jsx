import { Button } from "@heroui/react";
export default function RepoHeader({
  selectedRepo,
  isBookmarked,
  handleToggleBookmark,
}) {
  return (
    <div className="repo-heading">
      <div>
        <h2>{selectedRepo.full_name}</h2>
        <p>{selectedRepo.description || "No description provided."}</p>
      </div>
      <Button onClick={handleToggleBookmark}>
        {isBookmarked ? "Remove bookmark" : "Add bookmark"}
      </Button>
    </div>
  );
}
