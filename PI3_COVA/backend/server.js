// server.js - Versão final com fallback de modelo

require('dotenv').config();
const express = require('express');
// Importamos o tipo de erro específico para podermos identificá-lo
const { GoogleGenerativeAI, GoogleGenerativeAIFetchError } = require('@google/generative-ai');
const cors = require('cors');

const app = express();

// Configuração do CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://fourl-aplicativocov.onrender.com'
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Inicializa o cliente do Gemini
if (!process.env.GEMINI_API_KEY) {
  throw new Error('A variável de ambiente GEMINI_API_KEY não está definida.');
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configurações de segurança que serão usadas por ambos os modelos
const safetySettings = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
];

// Define o modelo primário (rápido)
const primaryModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: { temperature: 0.1 },
  safetySettings,
});

// Define o modelo de fallback (robusto)
const fallbackModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: { temperature: 0.1 },
  safetySettings,
});

// Rota principal da API com a nova lógica
app.post('/api/stream', async (req, res) => {
  const { prompt } = req.body;

  try {
    // 1. Tenta com o modelo primário
    console.log("Tentando com o modelo primário (gemini-1.5-flash)...");
    await streamFromModel(primaryModel, prompt, res);

  } catch (error) {
    // 2. Se falhar, verifica se o erro é de sobrecarga (503)
    if (error instanceof GoogleGenerativeAIFetchError && error.status === 503) {
      console.warn("Modelo primário sobrecarregado. Acionando fallback para gemini-1.5-pro...");
      
      try {
        // 3. Tenta com o modelo de fallback
        await streamFromModel(fallbackModel, prompt, res);
      } catch (fallbackError) {
        // 4. Se o fallback também falhar, envia um erro final
        console.error('Erro no modelo de fallback:', fallbackError);
        res.status(500).end('Erro no servidor: Ambos os modelos de IA estão indisponíveis.');
      }
    } else {
      // 5. Se for qualquer outro tipo de erro, envia um erro genérico
      console.error('Erro inesperado no streaming do Gemini:', error);
      res.status(500).end('Erro no servidor ao se comunicar com a API do Gemini.');
    }
  }
});

// Função auxiliar para evitar repetição de código
async function streamFromModel(model, prompt, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const result = await model.generateContentStream(prompt);
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    const responseData = { response: chunkText };
    res.write(`data: ${JSON.stringify(responseData)}\n\n`);
  }
  res.end();
}

// Inicia o servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend com fallback de IA pronto em http://localhost:${PORT}`);
});