import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const { collection, nFT } = new PrismaClient();

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };

  public appInitialized = (req: Request, res: Response, next: NextFunction) => {
    try {
      let { appKey } = req.body;
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
  
  public loadTokenData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const c = await collection.findFirst({where: {collectionURI: req.params.uri}});
      if (! c) {
        return res.sendStatus(404);
      }
      const n = await nFT.findFirst({where: {collectionId: c.id, tokenId: req.params.tokenId}});
      if (! n) {
        return res.sendStatus(404);
      }
      const attributes = JSON.parse(n.metaData)
        .map((attr) => ({
          trait_type: Object.keys(attr)[0],
          value: attr[Object.keys(attr)[0]]
        }));
      const nftObj = {
        name: n.name,
        image: n.image,
        description: n.description || "",
        attributes
      }
      res.send(nftObj);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
