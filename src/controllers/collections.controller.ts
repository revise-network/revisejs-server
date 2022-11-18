import { Pagination } from '@/interfaces/index.interface';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestWithUser } from '@/interfaces/auth.interface';
import nftsHelperService from '@services/nfts';

type Attribute = {
  [x in string]: any;
};

interface CreateNFTDTO {
  tokenId: string;
  name: string;
  image: string;
  description?: string;
  metaData: Attribute;
}

const { collection, collectionInfo, nFT, nFTRevision } = new PrismaClient();
const nftsHelperServiceObj = new nftsHelperService();

class CollectionsController {
  public addCollection = async (req: RequestWithUser, res: Response) => {
    const { collectionName, collectionURI }: { collectionName: string; collectionURI: string } = req.body;
    if (!collectionURI || !collectionName) {
      return res.status(400).send({ code: 'MII' });
    }

    try {
      const appAuthVerification = await nftsHelperServiceObj.getappAuthObj(req.headers.authorization);

      if(appAuthVerification.status==false || appAuthVerification.isError )
          return res.status(403).send({ code: 'IAT', message: 'Invalid Auth Token' });
      
      const existingCollection = await collection.findFirst({ where: { collectionURI } });
      if (existingCollection) {
        return res.status(400).send({ code: 'DURI' });
      }
      const info = await collectionInfo.create({
        data: {
          collectionURI,
          collectionName,
        },
        select: { id: true },
      });
      const collectionObj = await collection.create({
        data: {
          collectionName,
          collectionURI,
          infoId: info.id
        },
        select: { id: true },
      });

      return res.status(200).send({ id: collectionObj.id });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  };

  public fetchCollections = async (req: RequestWithUser, res: Response) => {
    // @todo-critical validate data
    try {
      const appAuthVerification = await nftsHelperServiceObj.getappAuthObj(req.headers.authorization);

      if(appAuthVerification.status==false || appAuthVerification.isError )
          return res.status(403).send({ code: 'IAT', message: 'Invalid Auth Token' });

      let { perPage, pageNumber }: Pagination = req.query || {};
      let per_page: number = (perPage || 10) > 50 ? 50 : (perPage || 10);
      const noOfRecordsToSkip: number = (pageNumber || 0) * per_page;
      const noOfRecordsToTake: number = Number(per_page);
      const collections = await collection.findMany({
        skip: noOfRecordsToSkip,
        take: noOfRecordsToTake
      });
      return res.status(200).send(collections);
    } catch (error) {
      return res.sendStatus(500);
    }
  };

  public fetchCollection = async (req: RequestWithUser, res: Response) => {
    // @todo-critical validate data
    try {
      const appAuthVerification = await nftsHelperServiceObj.getappAuthObj(req.headers.authorization);

      if(appAuthVerification.status==false || appAuthVerification.isError )
          return res.status(403).send({ code: 'IAT', message: 'Invalid Auth Token' });

      const collectionObj = await collection.findFirst({ where: { id: req.params.id } });
      if (collectionObj==null) {
        return res.status(400).send({ code: 'MII', message: 'Invalid Collection id' });
      }

      return res.status(200).send(collectionObj);
    } catch (error) {
      return res.sendStatus(500);
    }
  };

  public fetchNFTs = async (req: RequestWithUser, res: Response) => {
    // @todo-critical validate data
    const appAuthVerification = await nftsHelperServiceObj.getappAuthObj(req.headers.authorization);

    if(appAuthVerification.status==false || appAuthVerification.isError )
        return res.status(403).send({ code: 'IAT', message: 'Invalid Auth Token' });
    
    const { id } = req.params;
    const collectionObj = await collection.findFirst({ where: { id } });
    if (collectionObj === null || collectionObj === undefined) {
      return res.status(400).send({ code: 'MII', message: 'Invalid Collection ID' });
    }

    let { perPage, pageNumber }: Pagination = req.query || {};
    let per_page: number = (perPage || 10) > 50 ? 50 : (perPage || 10);
    const noOfRecordsToSkip: number = (pageNumber || 0) * per_page;
    const noOfRecordsToTake: number = Number(per_page);
    try {
      const nfts = await nFT.findMany({
        where: { collectionId: id },
        skip: noOfRecordsToSkip,
        take: noOfRecordsToTake,
        include: {
          collection: {
            select: {
              collectionName: true,
              collectionURI: true,
            },
          },
          _count: {
            select: {
              revisions: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      return res.status(200).send(nfts);
    } catch (error) {
      return res.sendStatus(500);
    }
  };

  public addNFT = async (req: RequestWithUser, res: Response) => {
    const appAuthVerification = await nftsHelperServiceObj.getappAuthObj(req.headers.authorization);

    if(appAuthVerification.status==false || appAuthVerification.isError )
        return res.status(403).send({ code: 'IAT', message: 'Invalid Auth Token' });
    
    const collectionObj = await collection.findFirst({ where: { id: req.params.id } });
    if (collectionObj==null) {
      return res.status(400).send({ code: 'MII', message: 'Invalid Collection ID' });
    }

    const { tokenId, name, image, metaData, description = '' }: CreateNFTDTO = req.body;
    const { id: collectionId } = req.params;
    if (!tokenId || !name || !image || !metaData) {
      return res.status(400).send({ code: 'MII', message: 'Invalid Collection NFT data'  });
    }
    if (typeof metaData === 'string') {
      return res.status(400).send({ code: 'MII', message: 'Invalid metadata' });
    }
    try {
      const createdNFT = await nFT.create({
        data: {
          format: 'ERC721',
          tokenId,
          name,
          image,
          description,
          metaData: JSON.stringify(metaData),
          collectionId,
        },
        select: { id: true },
      });
      const createdRevision = await nFTRevision.create({
        data: {
          nftId: createdNFT.id,
          tokenId,
          name,
          image,
          description,
          metaData: JSON.stringify(metaData),
        },
      });
      return res.send(createdNFT);
    } catch (error) {
      console.log(error);

      return res.sendStatus(500);
    }
  };
}

export default CollectionsController;
