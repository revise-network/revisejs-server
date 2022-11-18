import { logger } from '@utils/logger';
import tokenService from '@services/token';

const tokenServiceObj = new tokenService();

class nftsHelperService {
  public getappAuthObj = async (apiAuthHeaders) => {
    try {
        const appAuthBearerToken = apiAuthHeaders.split(' ')[1];
        if(appAuthBearerToken == undefined){
            throw Error;
        }
        const verificationResponse = await tokenServiceObj.verifyToken(appAuthBearerToken);
        return verificationResponse;
    } catch (error) {
      logger.error(`NFT Service for User Token Verification Failed`);
      return { status: false, message: error, isError:true };
    }
  };
}

export default nftsHelperService;