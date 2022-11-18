import { Router } from 'express';
import NFTsController from '@controllers/nfts.controller';
import { Routes } from '@interfaces/routes.interface';

class NFTsRoute implements Routes {
  public path = '/nfts';
  public router = Router();
  public nftsController = new NFTsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.delete(`${this.path}/:id`, this.nftsController.deleteNFT);
    this.router.put(`${this.path}/:id`, this.nftsController.updateNFT);
    this.router.get(`${this.path}/:id`, this.nftsController.fetchNFT);
    this.router.post(`${this.path}/addnft`, this.nftsController.addNFT);
    
    this.router.get(`${this.path}`, this.nftsController.fetchNFTs);
    this.router.get(`${this.path}/fetchnft/:id`, this.nftsController.fetchNftNoAuth);
    
    this.router.get(`${this.path}/:id/revisions`, this.nftsController.fetchNFTRevisions);
    this.router.get(`${this.path}/fetchrevisions/:id`, this.nftsController.fetchNFTRevisionsNoAuth);
  }
}

export default NFTsRoute;
