# Unijui-PI3-4l (COV)

<p align="center">
  <img src="https://static.wikia.nocookie.net/the-ossome-show/images/e/e2/Maxwell.gif/revision/latest/thumbnail/width/360/height/360?cb=20221230214511" alt="Mascote do Projeto" width="200" />
</p>

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![Coverage](https://img.shields.io/badge/coverage-95%25-blue)](#)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blueviolet)](#)

## 📑 Sumário

<details>
<summary>Clique para expandir</summary>

| Seção                                         | Descrição                              |
| --------------------------------------------- | -------------------------------------- |
| 📝 [Visão Geral](#-visão-geral)               | Contexto e tecnologias principais.     |
| 🎯 [Objetivos e Escopo](#-objetivos-e-escopo) | Metas e público-alvo.                  |
| ✨ [Funcionalidades](#-funcionalidades)       | Recursos oferecidos.                   |
| 📦 [Arquitetura](#-arquitetura-e-componentes) | Organização frontend, backend e infra. |
| 📚 [Tecnologias](#-tecnologias-utilizadas)    | Bibliotecas e frameworks.              |
| 🏗️ [Estrutura](#-estrutura-do-projeto)        | Diretórios e arquivos do projeto.      |
| ⚙️ [Pré-requisitos](#-pré-requisitos)         | Ferramentas necessárias.               |
| 🚀 [Instalação](#-instalação-e-execução)      | Como rodar o projeto.                  |
| 🎬 [Demonstração](#-demonstração)             | Exemplos visuais em GIF ou imagem.     |
| 👥 [Equipe e Autores](#-equipe-e-autores)     | Perfis e redes sociais.                |
| 🤝 [Contribuição](#-como-contribuir)          | Guia para forks e pull requests.       |
| 📜 [Licença](#-licença)                       | Termos de uso.                         |
| 📬 [Contato](#-contato)                       | Suporte e dúvidas.                     |

</details>

---

## 📝 Visão Geral

**Unijui-PI3-4l (COV)** é um assistente de IA médico desenvolvido na disciplina de Projeto Integrador III - Ciência de Dados e Analytics, projetado para agilizar atendimentos médicos.

* **Frontend**: React (Vite) com temas claro/escuro.
* **Backend**: Node.js/Express expos APIs REST.
* **Banco de Dados**: Firebase Auth e Firestore.
* **IA**: Chatbot integrado a provedores de linguagem.

---

## 🎯 Objetivos e Escopo

<details>
<summary>Ver detalhes</summary>

1. **Objetivo**: Criar um assistente inteligente para agilizar atendimentos médicos.
2. **Escopo**:

   * Autenticação de usuários.
   * Chat com IA e histórico persistente.
   * Tema claro/escuro.
   * Perfil personalizável.
3. **Público-alvo**: Pacientes e médicos.

</details>

---

## ✨ Funcionalidades

1. Autenticação segura (Firebase Auth).
2. Alternância de tema (Light/Dark).
3. Chat com IA e histórico de conversas.
4. Perfil de usuário com preferências de cor.

---

## 📦 Arquitetura e Componentes

<details>
<summary>Visão geral da arquitetura</summary>

* **Frontend**: React, React Router, Context API, SCSS Modules.
* **Backend**: Node.js, Express.
* **Banco**: Firestore para dados de usuários e conversas.
* **Fluxo**: Requisições via Axios, token no header.

</details>

---

## 📚 Tecnologias Utilizadas

<details>
<summary>Ver detalhes</summary>

| Categoria      | Tecnologias                             |
| -------------- | --------------------------------------- |
| Frontend       | React, Vite, React Router, SCSS Modules |
| Backend        | Node.js, Express                        |
| Banco de Dados | Firebase Authentication, Firestore      |
| Ferramentas    | VSCode, ESLint, Prettier                |

</details>

---

## 🏗️ Estrutura do Projeto
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
│   └── 📁 src
│       ├── 📁 api
│       ├── 📁 assets
│       ├── 📁 components
│       ├── 📁 contexts
│       ├── 📁 pages
│       ├── 📁 public
│       ├── 📁 routes
│       ├── 📄 App.css
│       ├── 📄 global.scss
│       ├── 📄 index.css
│       └── 📄 main.jsx
│
├── 📁 node_modules
├── 📄 package-lock.json
└── 📄 package.json
```

---

## ⚙️ Pré-requisitos

* **Node.js** (>= 18)
* **npm**
* **Git**

---

## 🚀 Instalação e Execução

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/LucasSckenal/PI3-4l.git
   ```
2. **Instale dependências e inicie**:

   ```bash
   cd PI3-4l
   npm install
   npm start
   ```

> O servidor e o front serão iniciados automaticamente.

---

## 🎬 Demonstração

<p align="center">
  <img src="https://i.imgur.com/DrEkiZG.gif" alt="Demonstração" width="600" />
</p>

---

## 👥 Equipe e Autores

| Foto | Nome              | Função      | Links | E-Mail |
| ------------------ | ----------------- | ----------- | ---------------------- | ---------------------- |
| <img src="https://media.licdn.com/dms/image/v2/D4E03AQFns2kru92iog/profile-displayphoto-crop_800_800/B4EZfDYLmeHIAM-/0/1751329587208?e=1756944000&v=beta&t=x_iMvt65_BLqWZ0AiTfi4zqOqM2rmh1fKQtSUy4J8kw" alt="Henrique Luan" width="100"/>      | Henrique Luan     | Documentação | [LinkedIn](https://www.linkedin.com/in/henrique-luan-fritz-70412635a/)        | [Henrique.fritz@sou.unijui.edu.br](mailto:Henrique.fritz@sou.unijui.edu.br) |
| <img src="https://media.licdn.com/dms/image/v2/D4D03AQHOKsAV9swgxg/profile-displayphoto-shrink_800_800/B4DZPSQAoVGgAc-/0/1734399233028?e=1755734400&v=beta&t=JUotoU5dxhvtmANEcINB284Ijoq013jlnKnYAqe9S3Q" alt="Luan Vitor Casali Dallabrida" width="100"/>      | Luan Vitor Casali Dallabrida | Back-End, IA    | [LinkedIn](https://www.linkedin.com/in/luan-vitor-casali-dallabrida-20a60a342/)        | [luanvitorcd@gmail.com](mailto:luanvitorcd@gmail.com) |
| <img src="https://media.licdn.com/dms/image/v2/D4D03AQHJYyCBUevqJw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1724278920588?e=1755734400&v=beta&t=Fgc6HIJTyvkwkMyBaWnsFwtfasiP_pGEpol8wwHg4ak" alt="Lucas Sckenal" width="100"/>      | Lucas Sckenal     | Front-End | [LinkedIn](https://www.linkedin.com/in/lucassckenal/)        | [lucaspsckenal@gmail.com](mailto:lucaspsckenal@gmail.com) |

---

## 🤝 Como Contribuir

1. Fork do repositório.
2. Crie branch: `git checkout -b feature/nome`.
3. Faça commit e push.
4. Abra Pull Request.

---

## 📜 Licença

MIT © 2025 Henrique Luan, Luan Vitor Casali Dallabrida, Lucas Sckenal

---

## 📬 Contato

Para dúvidas ou sugestões, abra uma issue ou entre em contato via LinkedIn.

---

<p align="right"><em>Última atualização: 21 de junho de 2025.</em></p>
