import { cosineSimilarity } from '../utils/cosineSimilarity.js';
import fs from 'fs';
import path from 'path';
import openai from '../config/openai.config.js';


const __dirname = path.dirname(new URL(import.meta.url).pathname);

let wikiData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../data/wiki_data_with_embeddings.json'), 'utf8'));

export async function findRelevantContent(question) {
  const questionEmbeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: question,
    temperature: 0.3,
  });

  const questionEmbedding = questionEmbeddingResponse.data[0].embedding;

  const scoredItems = wikiData.map(item => {
    const similarity = cosineSimilarity(questionEmbedding, item.embedding);
    return { ...item, similarity };
  });

  const topItems = scoredItems.sort((a, b) => b.similarity - a.similarity).slice(0, 5);

  if (topItems.length === 0 || topItems[0].similarity < 0.4) {
    return null;
  }

  return {
    topItems: topItems.map(({ headline, content, linkWiki }) => ({
      headline,
      content,
      linkWiki,
    })),
  };
}
