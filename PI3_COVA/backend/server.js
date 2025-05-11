const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Configurar CORS APENAS para o frontend na porta 5173
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Rota para Streaming
app.post('/api/stream', async (req, res) => {
  try {
    const { prompt } = req.body;

    // Configurar headers para streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Chamar Ollama com streaming
    const ollamaResponse = await axios({
      method: 'post',
      url: 'http://localhost:11434/api/generate',
      responseType: 'stream',
      data: {
        model: 'mistral',
        prompt: prompt,
        stream: true
      }
    });

    // Encaminhar cada chunk do Ollama para o frontend
    ollamaResponse.data.on('data', (chunk) => {
      const data = chunk.toString();
      res.write(`data: ${data}\n\n`); // Formato SSE (EventSource)
    });

    ollamaResponse.data.on('end', () => {
      res.end(); // Fecha a conexão quando terminar
    });

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).end();
  }
});

// Iniciar servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend pronto para streaming em http://localhost:${PORT}`);
});