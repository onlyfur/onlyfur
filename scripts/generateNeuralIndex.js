const fs = require('fs');
const path = require('path');

const helpArticlesDir = path.join(__dirname, '../frontend/src/pages/help/articles');
const pagesDir = path.join(__dirname, '../frontend/src/pages');
const outputFile = path.join(__dirname, '../frontend/src/services/neuralIndex.generated.json');

function getTitleFromFileName(fileName) {
  // Remove extension and convert dashes/underscores to spaces, capitalize words
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function scanDirForPages(dir, baseRoute = '') {
  const files = fs.readdirSync(dir);
  const pages = [];
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file === 'admin' || file === 'support' || file === 'legal' || file === 'platform' || file === 'creators' || file === 'creator') continue; // skip admin/support/legal/platform/creators/creator for now
      pages.push(...scanDirForPages(fullPath, baseRoute + '/' + file));
    } else if (file.endsWith('.tsx')) {
      const route = baseRoute + '/' + file.replace(/\.[^.]+$/, '');
      pages.push({
        id: route.replace(/[\W_]+/g, '-').replace(/^-+|-+$/g, ''),
        url: route,
        title: getTitleFromFileName(file),
        description: '',
        tags: [],
        category: 'page',
      });
    }
  }
  return pages;
}

function scanHelpArticles() {
  if (!fs.existsSync(helpArticlesDir)) return [];
  return fs.readdirSync(helpArticlesDir)
    .filter(f => f.endsWith('.tsx'))
    .map(f => ({
      id: 'help-' + f.replace(/\.[^.]+$/, ''),
      url: '/help/articles/' + f.replace(/\.[^.]+$/, ''),
      title: getTitleFromFileName(f),
      description: '',
      tags: ['help'],
      category: 'help',
    }));
}

// Remove duplicates and only include articles that exist on disk
function dedupeAndFilterExisting(entries) {
  const seen = new Set();
  return entries.filter(entry => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    // For help articles, check file existence
    if (entry.category === 'help') {
      const filePath = path.join(helpArticlesDir, path.basename(entry.url) + '.tsx');
      return fs.existsSync(filePath);
    }
    return true;
  });
}

function main() {
  const helpArticles = scanHelpArticles();
  const pages = scanDirForPages(pagesDir);
  const all = dedupeAndFilterExisting([...helpArticles, ...pages]);
  fs.writeFileSync(outputFile, JSON.stringify(all, null, 2));
  console.log(`Indexed ${all.length} pages/articles to ${outputFile}`);
}

main();
