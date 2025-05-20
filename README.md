# Unijui-PI3-4l

<!-- Banner ou imagem destacada do projeto (opcional) -->

<p align="center">
  <img src="https://static.wikia.nocookie.net/the-ossome-show/images/e/e2/Maxwell.gif/revision/latest/thumbnail/width/360/height/360?cb=20221230214511" alt="Maxwell o gato irado girando">
</p>

---

## 📑 Table of Contents

| [📝 Descrição](#-descrição-do-projeto) | [✨ Funcionalidades](#-funcionalidades) | [📊 Aplicação](#-aplicação) | [🚀 Tecnologias](#-tecnologias-utilizadas) |
|----------------------------------------|--------------------------------------------|----------------------------------------|----------------------------------------|
| [📂 Estrutura](#-estrutura-do-projeto) | [🛠️ Pré-requisitos](#️-pré-requisitos) | [🏃‍♂️ Como Rodar](#️-como-rodar-o-projeto) | [👥 Autores](#-autores) |
| [🤝 Contribuindo](#-contribuindo) | [📜 Licença](#-licença) | [📬 Contato](#-contato) |

---

## 📝 Descrição do Projeto

O **Unijui-PI3-4l** codinome COV, é um assistente IA desenvolvido no contexto da disciplina de Projeto Integrador III. O sistema suporta:

O projeto utiliza:

- **Frontend**: React
- **Backend**: Node.js
- **Banco de Dados**: Firebase

---

## ✨ Funcionalidades

1. **Auth**: Sistema de login e register;
2. **Dark mode e Light mode**: Escolha de temas entre claro e escuro.
3. **IA**.
---

## 📊 Aplicação

<p align="center">
  <img src="" alt="Aplicação rodando">
</p>

---

## 🚀 Tecnologias Utilizadas

### Principais Ferramentas

- ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white&style=flat) : Criação do frontend interativo.
- ![NodeJS](https://img.shields.io/badge/-Node.js-E0234E?logo=nodejs&logoColor=white&style=flat) : Gerenciamento do backend.
- ![Firebase](https://img.shields.io/badge/-Firebase-336791?logo=Firebase&logoColor=white&style=flat) : Banco de dados.

---

## 📂 Estrutura do Projeto

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


---

## 🛠️ Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas antes de rodar o projeto:

- **Node.js** (versão 18 ou superior)
- **npm** (ou gerenciador de pacotes compatível)
- **PostgreSQL** (instância local ou remota configurada)

### Especificações mínimas do Hardware:
- PROCESSADOR:
- MEMÓRIA RAM:
---

## 🏃‍♂️ Como Rodar o Projeto

### 1️⃣ Clonar o Repositório

```bash
# Clone o repositório
$ git clone https://github.com/LucasSckenal/PI3-4l

# Acesse o diretório do projeto
$ cd Unijui-PI3-4l/PI3_COVA/
```

### 2️⃣ Configurar o Ambiente

#### Backend

1. Acesse o diretório:

```bash
$ cd backend
```

2. Instale as dependências:

```bash
$ npm install
```

3. Execute o servidor backend:

```bash
$ npm start
```

#### Frontend

1. Acesse o diretório:

```bash
$ cd frontend
```

2. Instale as dependências:

```bash
$ npm install
```

3. Execute o servidor frontend:

```bash
$ npm start
```

O frontend estará disponível em `http://localhost:5173` e o backend em `http://localhost:5000` (ou portas configuradas).

---

## 👥 Autores

O projeto foi desenvolvido por:
- **Henrique Luan**
  - **E-mail**: [Henrique.fritz@sou.unijui.edu.br](mailto:Henrique.fritz@sou.unijui.edu.br)
- **Luan Vitor**
  - **E-mail**: [luanvitorcd@gmail.com](mailto:luanvitorcd@gmail.com)
  - **LinkedIn**: [Luan Vitor](https://www.linkedin.com/in/luan-vitor-casali-dallabrida-20a60a342/)
- **Lucas Sckenal**
  - **E-mail**: [lucaspsckenal@gmail.com](mailto:lucaspsckenal@gmail.com)
  - **LinkedIn**: [Lucas Sckenal](https://www.linkedin.com/in/lucassckenal/)



---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga estas etapas para contribuir:

1. Faça um fork do repositório.
2. Crie uma branch para sua funcionalidade ou correção:

```bash
$ git checkout -b minha-nova-funcionalidade
```

3. Faça commit das suas alterações:

```bash
$ git commit -m "Minha nova funcionalidade"
```

4. Envie para o repositório remoto:

```bash
$ git push origin minha-nova-funcionalidade
```

5. Abra um Pull Request no repositório original.

---

## 📜 Licença

Este projeto está licenciado sob a licença **MIT**. Para mais informações, consulte o arquivo [LICENSE](LICENSE).

---

## 📬 Contato

Para dúvidas ou sugestões, entre em contato através dos e-mails ou LinkedIn listados na seção de autores.
