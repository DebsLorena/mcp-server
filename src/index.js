import Fastify from 'fastify';
import { chatController } from './api/chat.controller.js';
import fastifyCors from '@fastify/cors';

const fastify = Fastify({ logger: true });

fastify.register(fastifyCors, {
  origin: '*', 
});

fastify.post('/mcp/chat', chatController);

fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Servidor rodando em ${address}`);
});
