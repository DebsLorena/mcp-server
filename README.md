
# 🧠 MCP Server - Servidor de Chatbot Inteligente com Fastify e OpenAI

Este projeto é um servidor Node.js utilizando [Fastify](https://fastify.dev/) e a API da [OpenAI](https://platform.openai.com/docs/) para responder perguntas com base em uma base de conhecimento local (wiki embutida em JSON), utilizando embeddings vetoriais para encontrar o conteúdo mais relevante.

## 📦 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Fastify](https://www.fastify.io/)
- [OpenAI Node SDK](https://www.npmjs.com/package/openai)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [fs (File System)](https://nodejs.org/api/fs.html)
- [@fastify/cors](https://www.npmjs.com/package/@fastify/cors)
- JavaScript moderno (ESM)
- Vetores de embeddings + Cosseno de similaridade

## 🚀 Funcionalidades

- Criação de endpoint `/mcp/chat` para receber perguntas e responder com base na wiki local.
- Filtragem semântica com embeddings e similaridade de cosseno.
- Respostas personalizadas com saudações e despedidas.
- Resposta alternativa quando nenhum conteúdo relevante é encontrado.
- Sugestão de links para conteúdos complementares na wiki.
- Tratamento de markdown para evitar formatação indesejada nas respostas.

## 📁 Estrutura do Projeto

```
📦 mcp-server/
├── 📂 src/
│   ├── 📂 api/                  # Controladores de rotas
│   │   └── chat.controller.js  # Lógica da rota POST /mcp/chat
│   │
│   ├── 📂 services/             # Camadas de negócio/serviço
│   │   ├── chat.service.js     # Função findRelevantContent, montagem do prompt
│   │   └── embeddings.service.js  # Lógica de gerar embeddings
│   │
│   ├── 📂 utils/                # Utilitários puros
│   │   ├── cosineSimilarity.js
│   │   ├── farewells.js
│   │   ├── greetings.js
│   │   ├── links.js
│   │   └── removeMarkdownFormatting.js
│   │
│   ├── 📂 config/               # Configuração de ambiente
│   │   └── openai.config.js    # Instância OpenAI
│   │
│   └── index.js                # Bootstrap do servidor (Fastify)
│
├── 📂 data/
│   ├── wiki_data.json
│   └── wiki_data_with_embeddings.json
│
├── 📂 scripts/
│   └── generateEmbeddings.js   # Script para gerar embeddings
│
├── .env
├── .gitignore
├── package.json
└── README.md
```
### 🧱 Arquitetura do Projeto

A estrutura do `mcp-server` segue uma arquitetura modular baseada em responsabilidades, com o objetivo de manter o projeto escalável, legível e de fácil manutenção:

- **`src/api/`**: Contém os controladores das rotas HTTP, responsáveis por receber requisições e orquestrar a lógica de serviço.
- **`src/services/`**: Lógica de negócio e manipulação de dados, incluindo busca semântica, geração de prompt e integração com a OpenAI.
- **`src/utils/`**: Funções utilitárias puras e reutilizáveis, como cálculo de similaridade, normalização de textos e mensagens de saudação/despedida.
- **`src/config/`**: Centraliza configurações externas e integração com APIs, como a inicialização da OpenAI.
- **`scripts/`**: Scripts auxiliares executáveis, como geração de embeddings para o conteúdo da wiki.
- **`data/`**: Armazena os arquivos JSON com os dados da wiki e seus embeddings vetoriais.
- **`index.js`**: Ponto de entrada da aplicação, onde o servidor Fastify é inicializado e as rotas são registradas.

Essa separação em camadas favorece a testabilidade e facilita futuras expansões do projeto.


## ⚙️ Instalação

1. **Clone o repositório**:
   ```bash
   git clone (não está no git)
   cd mcp-server
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   Crie um arquivo `.env` na raiz com o seguinte conteúdo:

   ```env
   OPENAI_API_KEY=your_openai_key_here
   ```

4. **Gere seu arquivo de embeddings**:
   Certifique-se de ter o arquivo `wiki_data_with_embeddings.json` na raiz do projeto. Ele deve conter um array de objetos no formato:

   ```json
   [
     {
       "headline": "Título do artigo",
       "content": "Conteúdo textual",
       "embedding": [0.123, 0.456, ...],
       "linkWiki": "https://link.com"
     }
   ]
   ```

## ▶️ Executando o Servidor

```bash
node index.js
```

O servidor irá iniciar em `http://localhost:3001`.

## 📡 Endpoint Disponível

### `POST /mcp/chat`

**Descrição:** Recebe uma pergunta do usuário, busca por conteúdo relevante na wiki local e retorna uma resposta gerada pela OpenAI com base nesse contexto.

#### Requisição:
```json
{
  "question": "O que é inteligência artificial?"
}
```

#### Resposta:
```json
{
  "answer": "Inteligência artificial é um ramo da ciência da computação que..."
}
```

## 🧠 Lógica Principal

1. **Tratamento de Saudações**
- Se a pergunta for uma saudação curta (ex: "oi", "olá"), retorna uma saudação aleatória usando `getGreeting()`.

2. **Busca por Contexto**
- Calcula o embedding da pergunta usando `text-embedding-3-small`.
- Compara com os embeddings da wiki usando a função `cosineSimilarity`.
- Ordena os resultados por similaridade e seleciona os 5 mais relevantes.

3. **Resposta com OpenAI**
- Envia o conteúdo relevante da wiki junto com a pergunta para o modelo `gpt-4.1`.
- A resposta é limpa de markdown e combinada com uma saudação e link sugerido (se houver).

4. **Fallback Inteligente**
- Se não houver similaridade suficiente, retorna um resumo amigável com os tópicos da wiki disponíveis.

## 📌 Utilitários

- `cosineSimilarity.js`: Função para calcular a similaridade de cosseno entre vetores.
- `greetings.js`: Geração e verificação de saudações.
- `farewells.js`: Retorna uma despedida aleatória.
- `removeMarkdownFormatting.js`: Remove formatação markdown de strings.

## ✅ Exemplo de Uso com cURL

```bash
curl -X POST http://localhost:3001/mcp/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Fale sobre redes neurais"}'
```

## 🛡️ Segurança e CORS

O CORS está habilitado para todas as origens (`origin: '*'`). Para produção, recomenda-se restringir para domínios específicos.

## 📖 Próximos Passos 🛠️ Melhorias 

### 🔐 Controle de Acesso e Personalização
- **Implementar retornos personalizados para diferentes papéis de usuário**: Separar respostas e permissões entre usuários comuns e administradores, garantindo segurança e adequação do conteúdo.

### ⚡ Desempenho e Eficiência
- **Adicionar sistema de cache para embeddings**: Evitar o cálculo redundante de embeddings para perguntas recorrentes, melhorando o tempo de resposta e reduzindo custos com a API da OpenAI.

### 💬 Qualidade das Respostas
- **Aprimorar respostas a mensagens simples**: Tornar respostas mais naturais para expressões como "obrigado", "boa noite", "valeu", etc.
- **Incluir suporte a formatação avançada**: Permitir que o chatbot formate respostas como listas, tabelas ou blocos de código quando solicitado, enriquecendo a experiência do usuário.

### 🖥️ Experiência do Usuário
- **Manter o chatbox aberto ao navegar entre telas**: Garantir persistência do estado da conversa para melhorar a continuidade do atendimento.
- **Implementar histórico de conversas**: Armazenar o histórico das interações dos usuários, possibilitando consultas posteriores, aprendizado e contexto contínuo.

### 📊 Administração e Monitoramento
- **Criar painel administrativo web**: Visualizar logs, perguntas realizadas, métricas de uso e estatísticas de desempenho, facilitando a gestão e melhoria contínua do sistema.

### 🗄️ Persistência e Escalabilidade
- **Integrar um banco de dados vetorial**: Substituir a leitura direta do arquivo `wiki_data_with_embeddings.json` por uma solução especializada como Qdrant, Pinecone, Weaviate ou pgvector, otimizando a busca semântica e escalabilidade.

### 🧠 Inteligência e Personalização
- **Adicionar aprendizado de preferências do usuário**: Adaptar respostas com base no histórico ou perfil do usuário.
- **Oferecer sugestões proativas**: Quando o usuário fizer perguntas vagas, oferecer exemplos ou tópicos relacionados automaticamente.


## 🧑‍💻 Autor

Desenvolvido por **Lorena Debs**.

