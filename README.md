# PI3-4l

<p align="center">
  <img src="https://static.wikia.nocookie.net/the-ossome-show/images/e/e2/Maxwell.gif/revision/latest/thumbnail/width/360/height/360?cb=20221230214511" alt="Maxwell o gato irado girando">
</p>

## 📂 Estrutura do Projeto

```plaintext
voice-transcription-backend/
│── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── transcribe.py     # Rota para transcrição de áudio
│   │   │   ├── health.py         # Rota para verificar o status do servidor
│   │   │   ├── recordings.py     # Rota para salvar e recuperar gravações
│   │   ├── dependencies.py       # Configuração de dependências da API
│   ├── core/
│   │   ├── config.py             # Configurações gerais do backend
│   ├── services/
│   │   ├── transcriber.py        # Serviço de transcrição de voz (Whisper)
│   │   ├── storage.py            # Serviço para salvar e recuperar áudios
│   ├── models/
│   │   ├── transcription.py      # Modelo para resposta da transcrição
│   │   ├── recording.py          # Modelo para gerenciar gravações
│   ├── utils/
│   │   ├── audio_processing.py   # Funções auxiliares de áudio (conversão, compressão)
│   ├── main.py                   # Arquivo principal para rodar o FastAPI
│── recordings/                    # Pasta para armazenar arquivos de áudio
│── tests/
│   ├── test_transcription.py      # Testes unitários para a transcrição
│   ├── test_recordings.py         # Testes para upload e recuperação de áudio
│── requirements.txt               # Dependências do projeto
│── README.md                      # Documentação do projeto
│── .env                           # Variáveis de ambiente (API keys, configs)
│── .gitignore                      # Arquivos a serem ignorados no Git
```
