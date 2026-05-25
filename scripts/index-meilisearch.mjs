import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MeiliSearch } from 'meilisearch';

const MEILI_HOST = process.env.MEILISEARCH_HOST || 'http://127.0.0.1:7700';
const MEILI_API_KEY = process.env.MEILISEARCH_KEY || '';

const client = new MeiliSearch({
  host: MEILI_HOST,
  apiKey: MEILI_API_KEY,
});

async function run() {
  console.log(`Connecting to Meilisearch at ${MEILI_HOST}...`);
  try {
    const health = await client.health();
    console.log(`Meilisearch health: ${health.status}`);
  } catch (e) {
    console.error(`Failed to connect to Meilisearch: ${e.message}`);
    console.log('Skipping index generation.');
    process.exit(0);
  }

  const indexName = 'sentinel_docs';
  try {
    await client.deleteIndex(indexName);
    console.log(`Deleted existing index '${indexName}'`);
  } catch (e) {
    // Ignore error if index doesn't exist
  }

  const index = client.index(indexName);
  console.log(`Created index '${indexName}'`);

  // Configure ranking rules to prioritize exact attribute matches
  await index.updateSettings({
    searchableAttributes: ['title', 'description', 'content'],
    displayedAttributes: ['id', 'title', 'description', 'path', 'view', 'component'],
    rankingRules: [
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness'
    ],
  });
  console.log('Updated index settings.');

  const documents = [];

  function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        traverseDir(fullPath);
      } else if (fullPath.endsWith('.md') || fullPath.endsWith('.mdx')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const { data, content: markdownBody } = matter(content);

        // Derive URL path from file path
        // e.g. content/engineering/hyperion-xdp/overview.mdx -> /engineering/hyperion-xdp/overview
        const relPath = path.relative('content', fullPath);
        const urlPath = '/' + relPath.replace(/\.mdx?$/, '');
        
        // Generate a deterministic ID
        const id = relPath.replace(/\//g, '-').replace(/\.mdx?$/, '');

        documents.push({
          id,
          title: data.title || path.basename(file, path.extname(file)),
          description: data.description || '',
          content: markdownBody,
          path: urlPath,
          view: data.view || 'engineer',
          component: data.component || '',
        });
      }
    }
  }

  const contentDir = path.resolve('content');
  if (fs.existsSync(contentDir)) {
    console.log(`Parsing documents in ${contentDir}...`);
    traverseDir(contentDir);
  } else {
    console.warn('Content directory not found!');
  }

  console.log(`Found ${documents.length} documents to index.`);
  
  if (documents.length > 0) {
    const task = await index.addDocuments(documents);
    console.log(`Added documents. Task UID: ${task.taskUid}`);
    console.log('Meilisearch indexing complete.');
  }
}

run();
