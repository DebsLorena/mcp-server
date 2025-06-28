import { OpenAI } from 'openai';
import fs from 'fs';
import dotenv from 'dotenv';
import { removeMarkdownFormatting } from '../src/utils/removeMarkdownFormatting.js';
import { links } from '../src/utils/links.js';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const wikiPath = './wiki_data.json';
let wikiData = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));

// Gera embeddings com apenas os campos essenciais
async function generateEmbeddings() {
  const itemsWithEmbeddings = [];

  for (const item of wikiData.items) {
    const cleanedHeadline = removeMarkdownFormatting(item.headline);
    const cleanedContent = removeMarkdownFormatting(item.content);
    const inputText = `${cleanedHeadline}\n\n${cleanedContent}`;

    // Encontra o link correspondente ao título
    const matchedLink = links.find(link => link.title.trim().toLowerCase() === cleanedHeadline.trim().toLowerCase());
    const linkWiki = matchedLink ? matchedLink.url : null;

    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: inputText,
      });

      const embedding = response.data[0].embedding;

      itemsWithEmbeddings.push({
        headline: cleanedHeadline,
        content: cleanedContent,
        linkWiki,
        embedding,
      });
      

      console.log(`✅ Embedding gerado para: ${item.headline}`);
    } catch (error) {
      console.error(`❌ Erro ao gerar embedding para: ${item.headline}`);
      console.error(error);
    }

    // Pequeno delay para evitar rate limits
    await new Promise((res) => setTimeout(res, 100));
  }

  // Salva SOMENTE os dados necessários
  fs.writeFileSync(
    './wiki_data_with_embeddings.json',
    JSON.stringify(itemsWithEmbeddings, null, 2),
  );

  console.log('✅ Embeddings salvos em wiki_data_with_embeddings.json');
}

generateEmbeddings();
