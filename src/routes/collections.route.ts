import { Router } from 'express';
import CollectionsController from '@controllers/collections.controller';
import { Routes } from '@interfaces/routes.interface';

class CollectionsRoute implements Routes {
  public path = '/collections';
  public router = Router();
  public collectionsController = new CollectionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {    
    this.router.post(`${this.path}`, this.collectionsController.addCollection);
    this.router.get(`${this.path}`, this.collectionsController.fetchCollections);
    this.router.get(`${this.path}/:id`, this.collectionsController.fetchCollection);

    this.router.get(`${this.path}/:id/nfts`, this.collectionsController.fetchNFTs);
    this.router.post(`${this.path}/:id/nfts`, this.collectionsController.addNFT);
  }
}

export default CollectionsRoute;
