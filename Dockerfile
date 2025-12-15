# Usa Node oficial
FROM node:18-alpine

# Cria diretório de trabalho
WORKDIR /app

# Copia package.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Build da aplicação (se for Next.js)
RUN npm run build

# Porta exposta
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"]