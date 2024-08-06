// gradingService.js

import {
  getLatestCommit,
  getTreeForCommit,
  fetchContentFromTree,
  gradeCode,
  checkGitHubRepoExists,
} from "./githubService.mjs";

async function grader(githubRepoLink, task, total_score) {
  try {
    if (!isValidGitHubRepoLink(githubRepoLink)) {
      console.error("Invalid GitHub repository link");
      throw new Error("Invalid Github repository link");
    }

    const matches = githubRepoLink.match(/github.com\/[A-z0-9-]+\/[A-z0-9-.]+/);
    if (!matches)
      if (!(await checkGitHubRepoExists(githubRepoLink))) {
        console.error("Repository does not exist");
        throw new Error("Repository does not exist");
      }

    const [owner, repo] = matches[0].split("/").slice(-2);

    const latestCommit = await getLatestCommit(owner, repo);
    const tree = await getTreeForCommit(
      owner,
      repo,
      latestCommit.commit.tree.sha
    );

    const allCode = await fetchContentFromTree(owner, repo, tree.tree, "");
    const gradeResult = await gradeCode(allCode, task, total_score);
    return gradeResult;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function isValidGitHubRepoLink(url) {
  const pattern =
    /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?/;
  return pattern.test(url);
}

export { grader, isValidGitHubRepoLink };
