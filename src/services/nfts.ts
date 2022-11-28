import { logger } from '@utils/logger';
import tokenService from '@services/token';

const os = require('os')
const fs = require('fs');
const path = require('path');
const tokenServiceObj = new tokenService();
const HOMEDIR = os.homedir();
const multer = require("multer");

class nftsHelperService {
  private mediaFolderLocalSystemPath = null;
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
  public createMediaFolderInsideReviseFolder = async () => {
    if (!fs.existsSync(path.join(HOMEDIR, '.revise/media'))) {
      console.log('Revise Media folder created');
      fs.mkdirSync((path.join(HOMEDIR, '.revise/media')));
    }
    return path.join(HOMEDIR, '.revise/media');
  }
  public uploadImageMediaFolderLocalSystemPath = async () => {
    return this.mediaFolderLocalSystemPath == null ? 
    await this.createMediaFolderInsideReviseFolder():
    this.mediaFolderLocalSystemPath;
  }
  public multerUploadObj = async () => {
    const mediaPath = await this.uploadImageMediaFolderLocalSystemPath();
    try {
      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, mediaPath)
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname)
        }
      });
      const upload = multer({
         storage: storage
        }).single("uploadedNftImage");
      return upload;
    } catch (error) {
      console.error(error);
    }
  }
}

export default nftsHelperService;