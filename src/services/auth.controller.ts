import { Request, Response } from 'express';
import tokenService from '@services/token';
import { sign } from 'jsonwebtoken';

class AuthController {
  public tokenService = new tokenService();

  public register = async (req: Request, res: Response) => {
    const userToken = await this.tokenService.createToken();

    if(typeof(userToken) === 'object'){
      return res.status(400).send( {code:userToken.code, message: userToken.message} );
    }else{
      return res.status(200).send(userToken);
    }
  };

  public generateToken = async () => {
    try {
      // Random Secret Key is for blacklisting process
      let randomSecretKey: string = Math.random().toString(36).slice(2, 10),
      jwt_key = process.env.SECRET;
      let dbData = {
        key: randomSecretKey
      };
      let token = await sign({ key: dbData.key }, jwt_key, { algorithm: 'HS256' });
      return token;
    } catch (error) {
      return error;
    }
  }
}

export default AuthController;
