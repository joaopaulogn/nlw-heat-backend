import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { router } from './routes';

const app = express();

// Subindo server com HTTP
const serverHttp = http.createServer(app);
const io = new Server(serverHttp, {
  cors: {
    origin: "*"
  }
});

/* Recebe um ouvinte de evento e qual o disparador desse evento
Nesse caso estamos "ouvindo" a conexão do usuário
*/
io.on("connection", socket => {
  console.log(`Usuário conectado no socket ${socket.id}`);
})

app.use(express.json());
app.use(cors());
app.use(router);

// Rota para redirecionar para a pagina de autenticação do GitHub
app.get("/github", (request, response) => {
  response.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
});

// Rota de callback que "pega" os dados de autenticação do usuário
// Neste caso o token é o parâmetro `code` retornado pela URL
app.get("/signin/callback", (request, response) => {
  const { code } = request.query;

  return response.json(code);
})

export { serverHttp, io };