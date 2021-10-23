import 'dotenv/config';
import axios from 'axios';
import { prismaClient } from '../prisma';
import { sign } from 'jsonwebtoken';

/*
- Receber o code (string) retornado pelo GitHub
- Recuperar o access_token no GitHub
- Recuperar as informações do usuário no GitHub
- Verificar se o usuário existe no banco de dados.
  Se SIM = gerar token para o mesmo
  Se NAO = criar no DB e gerar o token
- Retornar o token com as informações do usuário logado
*/

interface IAccessTokenResponse {
  access_token: string;
}

interface IUserResponse {
  avatar_url: string;
  login: string;
  id: number;
  name: string;
}

class AuthenticateUserService {
  async execute(code: string) {
    const url = "https://github.com/login/oauth/access_token";

    const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      headers: {
        "Accept": "application/json"
      },
    })

    const response = await axios.get<IUserResponse>('https://api.github.com/user', {
      headers: {
        authorization: `Bearer ${accessTokenResponse.access_token}`
      }
    })

    const { login, id, avatar_url, name } = response.data;

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id
      }
    });

    if (!user) {
      await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          name,
          avatar_url,
        }
      })
    };

    const token = sign(
      {
        user: {
          id,
          name,
          avatar_url
        }
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "1d"
      }
    )

    return { token, user };
  }
};

export { AuthenticateUserService };