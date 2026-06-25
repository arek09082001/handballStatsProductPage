#!/usr/bin/env node

/**
 * Script to validate that all target="_blank" links have proper rel attributes
 * Run with: node scripts/validate-external-links.js
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function findFiles(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  const files = [];

  function traverse(currentDir) {
    const items = readdirSync(currentDir);

    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);

      if (
        stat.isDirectory() &&
        !item.startsWith('.') &&
        item !== 'node_modules'
      ) {
        traverse(fullPath);
      } else if (stat.isFile() && extensions.includes(extname(item))) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

function validateExternalLinks() {
  const projectRoot = join(__dirname, '..');
  const files = findFiles(projectRoot);

  let totalIssues = 0;
  let totalFiles = 0;

  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      let fileIssues = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check for target="_blank" without rel attribute
        if (
          line.includes('target="_blank"') ||
          line.includes("target='_blank'")
        ) {
          // Check if the line or next few lines contain rel attribute
          const contextLines = lines.slice(Math.max(0, i - 2), i + 3).join(' ');

          if (!contextLines.includes('rel=')) {
            fileIssues++;
          } else {
            // Check if rel attribute has proper values
            const relMatch = contextLines.match(/rel=['"]([^'"]*)['"]/);
            if (relMatch) {
              const relValue = relMatch[1];
              if (
                !relValue.includes('noopener') &&
                !relValue.includes('noreferrer')
              ) {
                fileIssues++;
              }
            }
          }
        }
      }

      if (fileIssues > 0) {
        totalFiles++;
        totalIssues += fileIssues;
      }
    } catch (error) {
      console.error(`Error reading ${file}:`, error.message);
    }
  }

  if (totalIssues === 0) {
  } else {
    console.log(
      `\n📊 Summary: ${totalIssues} issues found in ${totalFiles} files`
    );
    console.log(
      '\n💡 Recommendation: Add rel="noopener noreferrer" to all target="_blank" links'
    );
  }

  return totalIssues;
}

// Only run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const issues = validateExternalLinks();
  process.exit(issues > 0 ? 1 : 0);
}

export { validateExternalLinks };
