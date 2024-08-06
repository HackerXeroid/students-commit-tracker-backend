// githubService.js
import dotenv from "dotenv";

import { Octokit } from "@octokit/rest";
import { Buffer } from "buffer";

import { run } from "./geminiService.mjs";

const octokit = new Octokit({
  auth: process.env.GITHUB_PAT,
});

async function checkGitHubRepoExists(owner, repo) {
  try {
    await octokit.repos.get({
      owner,
      repo,
    });
    return true; // The repository exists
  } catch (error) {
    if (error.status === 404) {
      return false; // The repository does not exist
    } else {
      throw error; // Some other error occurred
    }
  }
}

async function getLatestCommit(owner, repo) {
  try {
    const response = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: 1,
    });

    console.log("Commits fetched successfully");
    return response.data[0]; // Return the first (latest) commit
  } catch (error) {
    console.error("Error fetching latest commit:", error);
    throw error;
  }
}

async function getTreeForCommit(owner, repo, sha) {
  try {
    const response = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: sha,
      recursive: "true", // This will get all files, including those in subdirectories
    });

    // console.log("Tree fetched successfully");
    return response.data;
  } catch (error) {
    console.error("Error fetching tree:", error);
    throw error;
  }
}

async function getBlobContent(owner, repo, sha) {
  try {
    const response = await octokit.rest.git.getBlob({
      owner,
      repo,
      file_sha: sha,
    });
    const content = Buffer.from(response.data.content, "base64").toString(
      "utf-8"
    );
    // console.log("Blob fetched successfully");
    return content;
  } catch (error) {
    console.error("Error fetching blob:", error);
    throw error;
  }
}

async function fetchContentFromTree(owner, repo, tree, parentPath = "") {
  try {
    // Filter out files with ".class" suffix
    const filteredTree = tree.filter((file) => !file.path.endsWith(".class"));

    let ans = "";
    for (const file of filteredTree) {
      const currentPath = `${parentPath}${file.path}`;
      if (file.type === "blob") {
        const content = await getBlobContent(owner, repo, file.sha);
        ans += `file path: ${currentPath}\ncontent: ${content}`;
      } else if (file.type === "tree") {
        // Fetch the subtree only when needed
        const subtree = await getTreeForCommit(owner, repo, file.sha);
        await fetchContentFromTree(
          owner,
          repo,
          subtree.tree,
          `${currentPath}/`
        );
      }
    }

    return ans;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}

async function checkRateLimit() {
  try {
    const rateLimit = await octokit.rest.rateLimit.get();
    console.log(
      "Remaining rate limit",
      rateLimit.data.resources.core.remaining
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function gradeCode(code, task, total_score) {
  try {
    const prompt = `
      Task: ${task}
      Total Score: ${total_score}
      Code: ${code}
      Please grade this code based on the given task out of Total Score. Return your response in JSON format with the following structure:
      {
        "score": "A number between 0 and ${total_score},
        "feedback": "A very breif explanation that why ahve u not given full marks"
      }
      Provide only the JSON response in string format to avoid backtics of MD.
    `;
    const result = await run(prompt);

    return JSON.parse(result);
  } catch (err) {
    throw err;
  }
}

export {
  getLatestCommit,
  getTreeForCommit,
  fetchContentFromTree,
  gradeCode,
  checkRateLimit,
  getBlobContent,
  checkGitHubRepoExists,
};
