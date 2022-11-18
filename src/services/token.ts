import { sign, verify } from 'jsonwebtoken';
import { logger } from '@utils/logger';
import { DataStoredInAuthToken } from '@/interfaces/auth.interface';

class tokenService {
  public createToken = async () => {
    // @to get the auth token
    try {
      // Random Secret Key is for blacklisting process
      let randomSecretKey: string = Math.random().toString(36).slice(2, 10),
      jwt_key = process.env.SECRET;
      let token = await sign({ key: randomSecretKey }, jwt_key, { algorithm: 'HS256' });
      return token;
    } catch (error) {
      logger.error(`ERROR in User Token Generation - ${error.stack || error.message || error}`);
      return error;
    }
  };

  public verifyToken = async token => {
    try {
      let jwt_key = process.env.SECRET;
      const verificationResponse = (await verify(token, jwt_key)) as DataStoredInAuthToken;
      if (!verificationResponse.key) return { status: false, keyStatus: false };
      else return { status: true, keyStatus: true, decoded: verificationResponse };
    } catch (error) {
        logger.error(`Invalid User Token : Verification Failed`);
        return { status: false, message: error, isError:true };
    }
  };
}

export default tokenService;
