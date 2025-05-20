# PI3-4l

<p align="center">
  <img src="https://static.wikia.nocookie.net/the-ossome-show/images/e/e2/Maxwell.gif/revision/latest/thumbnail/width/360/height/360?cb=20221230214511" alt="Maxwell o gato irado girando">
</p>

# 🩺 COV – Consultation On-Demand Virtual

## Estrutura do Projeto
``` plain text
📁 Projeto
├── 📁 backend
│   ├── 📁 app/
│   ├── 📁 node_modules/
│   ├── 📄 package-lock.json
│   ├── 📄 package.json
│   └── 📄 server.js
│
├── 📁 frontend
│   ├── 📁 src
│   │   ├── 📁 api
│   │   │   └── 📄 firebase.jsx
│   │   │
│   │   ├── 📁 assets
│   │   │   └── 📄 react.svg
│   │   │
│   │   ├── 📁 components
│   │   │   ├── 📁 AboutUsModal/
│   │   │   ├── 📁 Divider/
│   │   │   ├── 📁 DropDownBtn/
│   │   │   ├── 📁 EditProfileModal/
│   │   │   ├── 📁 FooterBar/
│   │   │   ├── 📁 Header/
│   │   │   ├── 📁 MainPage/
│   │   │   ├── 📁 Message/
│   │   │   ├── 📁 MessageInputBar/
│   │   │   ├── 📁 PreferredColorModal/
│   │   │   ├── 📁 QuickMsg/
│   │   │   ├── 📁 Sidebar/
│   │   │   ├── 📁 SimpleModal/
│   │   │   └── 📁 SymptomsCarousel/
│   │   │
│   │   ├── 📁 contexts
│   │   │   ├── 📁 Account/
│   │   │   ├── 📁 AuthProvider/
│   │   │   ├── 📁 IaProvider/
│   │   │   ├── 📁 ScreenResizeProvider/
│   │   │   └── 📁 ThemeProvider/
│   │   │
│   │   ├── 📁 pages
│   │   │   ├── 📁 Auth/
│   │   │   ├── 📁 Chat/
│   │   │   ├── 📁 History/
│   │   │   ├── 📁 Home/
│   │   │   ├── 📁 InnerChat/
│   │   │   ├── 📁 Profile/
│   │   │   └── 📁 Settings/
│   │   │
│   │   ├── 📁 public/
│   │   │
│   │   ├── 📁 routes
│   │   │   ├── 📄 PrivateRoutes.jsx
│   │   │   └── 📄 Routes.jsx
│   │   │
│   │   ├── 📄 App.css
│   │   ├── 📄 global.scss
│   │   ├── 📄 index.css
│   │   └── 📄 main.jsx
│   │
│   ├── 📄 .gitignore
│   ├── 📄 README.md
│   ├── 📄 eslint.config.js
│   ├── 📄 index.html
│   ├── 📄 package-lock.json
│   ├── 📄 package.json
│   └── 📄 vite.config.js
│
├── 📁 node_modules
├── 📄 package-lock.json
└── 📄 package.json

```

## 📌 Justificativa

### 🔴 Desafio:
Acesso rápido a atendimento médico ainda é um grande obstáculo para muitos pacientes, principalmente em sistemas de saúde sobrecarregados.  
**Problema identificado:** Dificuldade de acesso a atendimento rápido.

---

## 💡 Solução

### ✅ Proposta:
**COV (Consultation On-Demand Virtual)** é um assistente virtual inteligente desenvolvido com IA, voltado para **triagem inicial ágil**.  

### 🌟 Pontos Positivos:
- ✅ Interface intuitiva para pacientes e profissionais;
- ✅ Acessibilidade;
- ✅ Eficiência.

---

## 🛠️ Tecnologias Utilizadas

| Camada         | Tecnologias |
|----------------|-------------|
| **Front-end**  | React ⚛️ |
| **Back-end**   | Nest.js |
| **Banco de Dados** | Firebase 🔥 |
| **IA**         | Mistral 🤖 |
| **Ferramentas**| VSCode, GitHub, Jira, Figma |

---

## 🧪 Metodologia

### 📌 Metodologias Ágeis:
- **Scrum** com sprints que incluem:
  - Planejamento
  - Desenvolvimento
  - Revisão
  - Retrospectiva
- **Kanban** para organização visual de tarefas:
  - Colunas de *Requested*, *In Progress*, e *Done*;
  - Limites de WIP;
  - Cards e Swimlanes para rastreio.

---

## 🚧 Progresso Atual

Atualmente, o projeto conta com:

- Uma **interface de chat funcional**, onde o paciente pode informar sintomas e iniciar a triagem;
- Tela de configurações com funcionalidades básicas, como:
  - **Modo escuro (Dark Mode)**;
  - **Limpar histórico de conversa**;
  - **Deslogar da conta**.

---

## 🧭 Roadmap

O projeto é gerenciado utilizando o **Obsidian**, com um mapa mental que conecta:
- As etapas do fluxo do usuário;
- Protótipos de interface;
- Requisitos e backlog.

---

## 🚀 Futuro do Projeto

Funcionalidades planejadas incluem:

- ✅ Conversão de voz para texto via IA;
- ✅ Sistema de registro e login em cloud;
- ✅ Histórico de conversas armazenado;
- ✅ Integração completa com backend;
- ✅ Validação das respostas por profissionais da saúde;
- ✅ Integração com IA treinada em CID-10 G43 e G44 (Enxaqueca);
- ✅ Aprimoramento de UI/UX para uma experiência mais fluida.

---

## 📷 Prints

Imagens do protótipo e andamento do projeto foram utilizadas para ilustrar o progresso e estão disponíveis na pasta `/docs/img`.

---

## Dependências (hardware e software)
- Especificações necessárias para rodar IA
- Quais softwares ou bibliotecas ou IA instalar
  
---

## Iniciando Projeto
NPM START
---


## 🧑‍💻 Contribuidores

- Equipe multidisciplinar formada por desenvolvedores, designers e profissionais da saúde.
