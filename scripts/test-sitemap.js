#!/usr/bin/env node

/**
 * Simple script to test sitemap generation locally
 * Run with: node scripts/test-sitemap.js
 */

import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testSitemap() {
  try {
    // Start development server
    const server = exec('npm run dev', { cwd: path.join(__dirname, '..') });

    // Wait for server to start
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Test sitemap endpoint
    const response = await fetch('http://localhost:3000/sitemap.xml');

    if (response.ok) {
      // Count URLs
    } else {
      console.error('❌ Sitemap request failed:', response.status);
    }

    // Test robots.txt
    const robotsResponse = await fetch('http://localhost:3000/robots.txt');

    if (robotsResponse.ok) {
    } else {
      console.error('❌ Robots.txt request failed:', robotsResponse.status);
    }

    // Kill server
    server.kill();
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Only run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testSitemap();
}

export { testSitemap };
