#!/usr/bin/env node

/**
 * InfiQ - Installation Verification Script
 * Checks that all files are in place and project is ready to run
 */

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'tailwind.config.ts',
  'postcss.config.js',
  '.env.example',
  '.gitignore',
  'README.md',
  'Dockerfile',
  'docker-compose.yml',
  'LICENSE',
];

const requiredDirectories = [
  'app',
  'app/api',
  'components',
  'lib',
  'services',
  'types',
  'utils',
  'hooks',
  'public',
];

const requiredApiRoutes = [
  'app/api/leads/route.ts',
  'app/api/leads/[id]/route.ts',
  'app/api/research/route.ts',
  'app/api/audit/route.ts',
  'app/api/pdf/route.ts',
  'app/api/email/route.ts',
  'app/api/sheets/route.ts',
  'app/api/drive/route.ts',
  'app/api/health/route.ts',
];

const requiredPages = [
  'app/page.tsx',
  'app/layout.tsx',
  'app/submit/page.tsx',
  'app/success/[id]/page.tsx',
  'app/admin/page.tsx',
];

function checkFile(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

function checkDir(dirPath) {
  return fs.existsSync(path.join(process.cwd(), dirPath));
}

function main() {
  console.log('🔍 InfiQ Installation Verification\n');

  let passed = 0;
  let failed = 0;

  // Check files
  console.log('📄 Checking configuration files...');
  requiredFiles.forEach((file) => {
    if (checkFile(file)) {
      console.log(`  ✅ ${file}`);
      passed++;
    } else {
      console.log(`  ❌ ${file} - MISSING`);
      failed++;
    }
  });

  // Check directories
  console.log('\n📁 Checking directories...');
  requiredDirectories.forEach((dir) => {
    if (checkDir(dir)) {
      console.log(`  ✅ ${dir}/`);
      passed++;
    } else {
      console.log(`  ❌ ${dir}/ - MISSING`);
      failed++;
    }
  });

  // Check API routes
  console.log('\n🔌 Checking API routes...');
  requiredApiRoutes.forEach((route) => {
    if (checkFile(route)) {
      console.log(`  ✅ ${route}`);
      passed++;
    } else {
      console.log(`  ❌ ${route} - MISSING`);
      failed++;
    }
  });

  // Check pages
  console.log('\n📄 Checking pages...');
  requiredPages.forEach((page) => {
    if (checkFile(page)) {
      console.log(`  ✅ ${page}`);
      passed++;
    } else {
      console.log(`  ❌ ${page} - MISSING`);
      failed++;
    }
  });

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('='.repeat(50));

  if (failed === 0) {
    console.log('\n🎉 All checks passed! Project is ready.\n');
    console.log('Next steps:');
    console.log('1. npm install');
    console.log('2. cp .env.example .env.local');
    console.log('3. Edit .env.local with your API keys');
    console.log('4. npm run dev');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some files are missing. Please check the list above.\n');
    process.exit(1);
  }
}

main();
