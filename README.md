
# FURIA FanHub

[![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.14.1-green?logo=mongodb)](https://www.mongodb.com/)

Plataforma gamificada para torcedores da FURIA, onde é possível completar missões, acumular pontos, subir de nível e resgatar recompensas exclusivas. O objetivo é engajar a comunidade, incentivar a participação dos torcedores e recompensar sua paixão pelo time com experiências únicas e interativas.



## 🚀 Funcionalidades Principais

- ✅ Missões interativas (quizzes, upload de vídeos, redes sociais)
- 🏆 Sistema de XP e níveis progressivos
- 🎁 Loja virtual para resgate de recompensas
- 📊 Dashboard com estatísticas de progresso
- 🔐 Autenticação segura com bcrypt
- 📱 Design responsivo com Tailwind CSS


## 🛠️ Tecnologias Utilizadas

- **Frontend:** Next.js 14, React 19, Tailwind CSS
- **Backend:** Node.js, Next.js API Routes
- **Banco de Dados:** MongoDB (Mongoose ODM)
- **Autenticação:** bcrypt, sessões HTTP
- **Ferramentas:** ESLint, PostCSS


## 🔧 Instalação

**Pré-requisitos:**

- Node.js (v16+)
- MongoDB
- NPM ou Yarn

## ⚡ Como Executar Localmente
- **Clone o repositório**

```bash
git clone https://github.com/VitorTamais/furia-fanhub.git
cd furia-fanhub
```

- **Instale as dependências**

```bash
npm install
```

- **Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raíz do projeto:

```bash
MONGODB_URI=sua_string_de_conexao_mongodb
```

- **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

- Acesse a aplicação:
Acesse: [http://localhost:3000](http://localhost:3000)



## 📂 Estrutura de Pastas

```bash
furia-fan-hub/
├── src/
│ ├── app/ # Rotas da aplicação
│ ├── components/ # Componentes React
│ ├── context/ # Contextos globais
│ └── models/ # Schemas do MongoDB
├── public/ # Assets estáticos
└── tailwind.config.js # Configuração do Tailwind
```


## 👥 Contribuição

Contribuições são bem-vindas! Para contribuir:

- Faça um Fork do projeto

- Crie uma branch para sua feature (git checkout -b feature/feature-incrivel)

- Commit suas mudanças (git commit -m 'adicionando uma feature incrivel')

- Push para a branch (git push origin feature/feature-incrivel)

- Abra um Pull Request


## 📄 Licença

Desenvolvido com 🧡 para o desafio da FURIA Esports, espero que tenham gostado!

