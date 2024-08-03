import { Octokit } from "@octokit/rest";
import { Buffer } from 'buffer';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const owner = 'siddham-jain';
const repo = 'multithreading-winnings';

async function getLatestCommit(owner, repo) {
  try {
    const response = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: 1
    });

    console.log("Commits fetched successfully");
    return response.data[0]; // Return the first (latest) commit
  } catch (error) {
    console.error('Error fetching latest commit:', error);
    throw error;
  }
}

async function getTreeForCommit(owner, repo, sha) {
  try {
    const response = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: sha,
      recursive: 'true' // This will get all files, including those in subdirectories
    });

    console.log("Tree fetched successfully");
    return response.data;
  } catch (error) {
    console.error('Error fetching tree:', error);
    throw error;
  }
}

async function getBlobContent(owner, repo, sha) {
  try {
    const response = await octokit.rest.git.getBlob({
      owner,
      repo,
      file_sha: sha
    });
    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    console.log("Blob fetched successfully");
    return content;
  } catch (error) {
    console.error('Error fetching blob:', error);
    throw error;
  }
}

async function main() {
  try {
    // Get the latest commit
    const latestCommit = await getLatestCommit(owner, repo);
    console.log('Latest commit SHA:', latestCommit.sha);

    // Get the tree for the latest commit
    const tree = await getTreeForCommit(owner, repo, latestCommit.commit.tree.sha);
    console.log('Tree SHA:', tree.sha);

    // Find Main.java in the tree
    const mainJavaFile = tree.tree.find(file => file.path === "Main.java");

    if (mainJavaFile) {
      console.log('Main.java SHA:', mainJavaFile.sha);

      // Get the content of Main.java
      const content = await getBlobContent(owner, repo, mainJavaFile.sha);
      console.log('Main.java content:', content);
    } else {
      console.log('Main.java not found in the repository');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();