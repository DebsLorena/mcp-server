import { findRelevantContent } from './embeddings.service.js';
import { removeMarkdownFormatting } from '../utils/removeMarkdownFormatting.js';
import { getGreeting, isGreetingOnly } from '../utils/greetings.js';
import { getFarewell } from '../utils/farewells.js';
import openai from '../config/openai.config.js';

export async function handleChatQuestion(question) {
  const normalizedQuestion = question.toLowerCase().trim();
  const userGreetingOnly = isGreetingOnly(normalizedQuestion);

  if (userGreetingOnly) {
    return getGreeting();
  }

  const contextResult = await findRelevantContent(question);
  
  if (!contextResult) {
    return `Não encontrei uma resposta exata para sua pergunta, mas posso te ajudar com muitos assuntos!`;
  }

  const context = contextResult.topItems
    .map(item => `Título: ${item.headline}\n${item.content}`)
    .join('\n\n');

  const prompt = `A seguir está o conteúdo da wiki relacionado:\n${context}\n\nResponda a pergunta:\n"${question}"\nResposta:`;

  try {
    const llmResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const rawAnswer = llmResponse.choices[0].message.content.trim();
    const cleanAnswer = removeMarkdownFormatting(rawAnswer);
    const farewell = getFarewell();

    return `${userGreetingOnly ? getGreeting() + ' ' : ''}${cleanAnswer} ${farewell}`;
  } catch (error) {
    throw new Error('Erro ao se comunicar com a OpenAI');
  }
}
