import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const TARGET_DIR = process.argv[2] || 'content/generated';
const COMPONENT_TAG = process.argv[3] || 'api'; // Default tag

if (!fs.existsSync(TARGET_DIR)) {
  console.log(`Target directory ${TARGET_DIR} does not exist. Skipping metadata injection.`);
  process.exit(0);
}

// Get the current git commit hash
let commitHash = 'unknown';
try {
  commitHash = execSync('git rev-parse --short HEAD').toString().trim();
} catch (e) {
  console.warn('Could not get git commit hash, defaulting to "unknown".');
}

const currentDate = new Date().toISOString();

function injectMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // If it already has frontmatter, skip or update?
  // Since these are freshly generated, they usually don't have frontmatter.
  // Doxybook2 might generate a title like `# MyClass` on the first line.
  
  let newContent = content;
  
  // Extract a title from the first heading if possible
  let title = path.basename(filePath, path.extname(filePath));
  const titleMatch = content.match(/^#\s+(.*)$/m);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }

  // Determine component from directory path or args
  let component = COMPONENT_TAG;
  if (filePath.includes('hyperion-xdp')) component = 'hyperion-xdp';
  if (filePath.includes('sentinel-vmi')) component = 'sentinel-vmi';
  if (filePath.includes('telos-lang')) component = 'telos-lang';
  if (filePath.includes('telos-runtime')) component = 'telos-runtime';

  const frontmatter = `---
title: "${title}"
view: "engineer"
component: "${component}"
commit: "${commitHash}"
date: "${currentDate}"
generated: true
---

`;

  // If frontmatter doesn't exist, prepend it
  if (!content.startsWith('---')) {
    newContent = frontmatter + content;
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Injected metadata into ${filePath}`);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.md') || fullPath.endsWith('.mdx')) {
      injectMetadata(fullPath);
    }
  }
}

traverseDir(TARGET_DIR);
console.log('Metadata injection complete.');
