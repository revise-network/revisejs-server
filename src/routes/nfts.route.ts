import { Router } from 'express';
import NFTsController from '@controllers/nfts.controller';
import { Routes } from '@interfaces/routes.interface';
import nftsHelperService from '@services/nfts';

const nftsHelperServiceObj = new nftsHelperService();

class NFTsRoute implements Routes {
  public path = '/nfts';
  public router = Router();
  public nftsController = new NFTsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = async () => {
    const getMediaUploadObj = await nftsHelperServiceObj.multerUploadObj();
    this.router.delete(`${this.path}/:id`, this.nftsController.deleteNFT);
    this.router.put(`${this.path}/:id`, this.nftsController.updateNFT);
    this.router.get(`${this.path}/:id`, this.nftsController.fetchNFT);
    this.router.post(`${this.path}/addnft`, this.nftsController.addNFT);
    
    this.router.get(`${this.path}`, this.nftsController.fetchNFTs);
    this.router.get(`${this.path}/fetchnft/:id`, this.nftsController.fetchNftNoAuth);
    
    this.router.get(`${this.path}/:id/revisions`, this.nftsController.fetchNFTRevisions);
    this.router.get(`${this.path}/fetchrevisions/:id`, this.nftsController.fetchNFTRevisionsNoAuth);

    this.router.post(`${this.path}/add-image-for-nft`, getMediaUploadObj, this.nftsController.addImage);
  }
}

export default NFTsRoute;
