// server.js - Versão atualizada para usar a API do Gemini

// Importa as bibliotecas necessárias
require('dotenv').config(); // Carrega as variáveis do arquivo .env
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();

// Lista de origens permitidas
const allowedOrigins = [
  'http://localhost:5173',
  'https://fourl-aplicativocov.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite requisições sem 'origin' (como apps mobile ou Postman) ou se a origem estiver na lista
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// Configuração do CORS para permitir requisições no frontend
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Inicializa o cliente do Gemini com a chave de API
if (!process.env.GEMINI_API_KEY) {
  throw new Error('A variável de ambiente GEMINI_API_KEY não está definida.');
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Rota para Streaming, o contrato com o frontend permanece o mesmo
app.post('/api/stream', async (req, res) => {
  try {
    const { prompt } = req.body;

    // Seleciona o modelo do Gemini. 'gemini-1.5-flash' é rápido e poderoso.
    // Configurações como temperature: 0.0 garantem respostas mais determinísticas.
    // NOVO CÓDIGO COM AJUSTE DE SEGURANÇA
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.1,
  },
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_NONE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_NONE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_NONE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_NONE",
    },
  ],
});

    // Configura os headers para streaming (Server-Sent Events)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Inicia a chamada de streaming para a API do Gemini
    const result = await model.generateContentStream(prompt);

    // Itera sobre cada chunk da resposta do Gemini
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      // O frontend espera um objeto JSON com uma propriedade "response"
      // Nós recriamos essa estrutura para manter a compatibilidade
      const responseData = { response: chunkText };
      res.write(`data: ${JSON.stringify(responseData)}\n\n`); // Envia no formato SSE
    }

    // Fecha a conexão quando o streaming terminar
    res.end();

  } catch (error) {
    console.error('Erro no streaming do Gemini:', error);
    res.status(500).end('Erro no servidor ao se comunicar com a API do Gemini');
  }
});

// Inicia o servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend pronto para streaming com Gemini em http://localhost:${PORT}`);
});