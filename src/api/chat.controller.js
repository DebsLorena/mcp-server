import * as chatService from '../services/chat.service.js';

export async function chatController(request, reply) {
  const { question } = request.body;
  
  try {
    const answer = await chatService.handleChatQuestion(question);
    return { answer };
  } catch (error) {
    reply.status(500).send({ error: 'Erro interno' });
  }
}
