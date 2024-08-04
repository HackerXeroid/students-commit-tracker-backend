import { Octokit } from "@octokit/rest";
import { Buffer } from 'buffer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config('.env');

const octokit = new Octokit({
  auth: process.env.GITHUB_PAT
});

const owner = 'HackerXeroid';
const repo = 'students-commit-tracker-backend';

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

    // console.log("Tree fetched successfully");
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
    // console.log("Blob fetched successfully");
    return content;
  } catch (error) {
    console.error('Error fetching blob:', error);
    throw error;
  }
}

async function getFilePaths(owner, repo, sha) {
  try {
    const tree = await getTreeForCommit(owner, repo, sha);
    const filePaths = [];

    async function traverseTree(tree, parentPath = '') {
      for (const item of tree.tree) {
        const currentPath = `${parentPath}${item.path}`;
        if (item.type === 'blob') {
          filePaths.push(currentPath);
        } else if (item.type === 'tree') {
          const subtree = await getTreeForCommit(owner, repo, item.sha);
          await traverseTree(subtree, `${currentPath}/`);
        }
      }
    }

    await traverseTree(tree);
    return filePaths;
  } catch (error) {
    console.error('Error fetching file paths:', error);
    throw error;
  }
}

async function fetchContentFromTree(owner, repo, tree, parentPath = '') {
  try {
    // Filter out files with ".class" suffix
    const filteredTree = tree.filter(file => !file.path.endsWith(".class"));

    // Fetch and log content of each file
    for (const file of filteredTree) {
      const currentPath = `${parentPath}${file.path}`;
      if (file.type === 'blob') {
        const content = await getBlobContent(owner, repo, file.sha);
        console.log(`file path: ${currentPath}\ncontent: ${content}`);
      } else if (file.type === 'tree') {
        // Fetch the subtree only when needed
        const subtree = await getTreeForCommit(owner, repo, file.sha);
        await fetchContentFromTree(owner, repo, subtree.tree, `${currentPath}/`);
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

async function checkRateLimit() {
  try{
    const rateLimit = await octokit.rest.rateLimit.get();
    console.log('Remaining rate limit', rateLimit.data.resources.core.remaining);
  } catch(err){
    console.log(err);
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

    // Fetch and log content of each file recursively from the filtered tree
    await fetchContentFromTree(owner, repo, tree.tree);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}



// main();
// checkRateLimit();
console.log(process.env.GITHUB_PAT);