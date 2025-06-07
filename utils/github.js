const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['GITHUB_OWNER', 'GITHUB_REPO', 'GITHUB_TOKEN'];
requiredEnvVars.forEach(env => {
  if (!process.env[env]) {
    throw new Error(`Missing required environment variable: ${env}`);
  }
});

const uploadToGitHub = async ({
  filePath,
  originalName,
  branch = "main",
  folder = "images",
  cdnProvider = "jsdelivr"
}) => {
  

  try {
    // Verify file exists
    await fs.access(filePath);

    // Read file content
    const content = await fs.readFile(filePath, { encoding: 'base64' });

    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const cleanFileName = originalName
      .normalize('NFD')
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9.\-_~]/g, '')
      .toLowerCase()
      .replace(/(\.[\w\d_-]+)$/i, `-${uniqueSuffix}$1`);

    const githubApiUrl = `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${folder}/${cleanFileName}`;

    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };

    const payload = {
      message: `Upload ${cleanFileName}`,
      content,
      branch,
    };

    const response = await axios.put(githubApiUrl, payload, { headers });

    

    // Generate CDN URL
    const cdnUrl = cdnProvider.toLowerCase() === 'github'
      ? `https://raw.githubusercontent.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/${branch}/${folder}/${cleanFileName}`
      : `https://cdn.jsdelivr.net/gh/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}@${branch}/${folder}/${cleanFileName}`;

    
    return cdnUrl;

  } catch (error) {
    console.log(error)
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

module.exports = uploadToGitHub;
