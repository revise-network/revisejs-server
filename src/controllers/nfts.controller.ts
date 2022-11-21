import { Pagination } from '@/interfaces/index.interface';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestWithUser } from '@/interfaces/auth.interface';
import nftsHelperService from '@services/nfts';

const { nFT, nFTRevision } = new PrismaClient();
const nftsHelperServiceObj = new nftsHelperService();

type Attribute = {
  [x in string]: any;
};

interface CreateNFTDTO {
  collectionId?: string;
  tokenId: string;
  name: string;
  image: string;
  description?: string;
  metaData: Attribute;
}

class NFTsController {
  public updateNFT = async (req: RequestWithUser, res: Response) => {
    const appAuthVerification = await nftsHelperServiceObj.getappAuthObj(req.headers.authorization);

    if(appAuthVerification.status==false || appAuthVerification.isError )
        return res.status(403).send({ code: 'IAT', message: 'Invalid Auth Token' });
    
    const { id: nftId } = req.params;
    const nftObj = await nFT.findFirst({ where: { id: nftId } });
    if (nftObj === undefined || nftObj === null) {
      return res.status(400).send({ code: 'MII', message: 'Invalid NFT id' });
    }

    const { tokenId, name, image, metaData, description = '' } = req.body;
    if (!tokenId || !name || !image || !metaData) {
      return res.status(400).send({ code: 'MII', message: 'Invalid Data Provided' });
    }
    if (typeof metaData === 'string') {
      return res.status(400).send({ code: 'MII', message: 'Invalid metadata' });
    }

    await nFTRevision.create({
      data: {
        nftId,
        tokenId,
        name,
        image,
        description,
        metaData: JSON.stringify(metaData),
      },
    });
    await nFT.update({
      where: {
        id: nftId,
      },
      data: {
        tokenId,
        name,
        image,
        description,
        metaData: JSON.stringify(metaData),
      },
    });

    return res.sendStatus(200);
  };

  public deleteNFT = async (req: RequestWithUser, res: Response) => {
    const appAuthVerification = await nftsHelperServiceObj.getappAuthObj(req.headers.authorization);

    if(appAuthVerification.status==false || appAuthVerification.isError )
        return res.status(403).send({ code: 'IAT', message: 'Invalid Auth Token' });
    
    const { id: nftId } = req.params;
    const nftObj = await nFT.findFirst({ where: { id: nftId } });
    if (nftObj === undefined || nftObj === null) {
      return res.status(400).send({ code: 'MII', message: 'Invalid NFT id' });
    }

    await nFTRevision.deleteMany({
      where: {
        nftId,
      },
    });
    await nFT.deleteMany({
      where: {
        id: nftId,
      },
    });
    return res.sendStatus(200);
  };

  public addNFT = async (req: RequestWithUser, res: Response) => {
    const appAuthVerification = await nftsHelperServiceObj.getappAuthObj(req.headers.authorization);

    if(appAuthVerification.status==false || appAuthVerification.isError )
        return res.status(403).send({ code: 'IAT', message: 'Invalid Auth Token' });
    
    let { collectionId, tokenId, name, image, metaData, description = '' }: CreateNFTDTO = req.body;
    if (!tokenId || !name || !image || !metaData) {
      return res.status(400).send({ code: 'MII', message: 'Invalid Data Provided' });
    }
    collectionId = collectionId || null;
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
          collectionId: collectionId
        },
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
      return res.status(200).send({createdNftId: createdNFT.id , createdRevisionId: createdRevision.id });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  };

  public fetchNFT = async (req: RequestWithUser, res: Response) => {
    const appAuthVerification = await nftsHelperServiceObj.getappAuthObj(req.headers.authorization);

    if(appAuthVerification.status==false || appAuthVerification.isError )
        return res.status(403).send({ code: 'IAT', message: 'Invalid Auth Token' });

    const { id: nftId } = req.params;
    const nftObj = await nFT.findFirst({
      where: { id: nftId },
      include: {
        collection: {
          select: {
            collectionName: true,
          },
        },
        _count: {
          select: {
            revisions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    if (nftObj === undefined || nftObj === null) {
      return res.status(400).send({ code: 'MII', message: 'Invalid NFT id' });
    }
    return res.send(nftObj);
  };

  public fetchNFTs = async (req: RequestWithUser, res: Response) => {
    try {
      const appAuthVerification = await nftsHelperServiceObj.getappAuthObj(req.headers.authorization);
      
      if(appAuthVerification.status==false || appAuthVerification.isError )
        return res.status(403).send({ code: 'IAT', message: 'Invalid Auth Token' });

      let { perPage, pageNumber }: Pagination = req.query || {};
      let per_page: number = (perPage || 10) > 50 ? 50 : (perPage || 10);
      const noOfRecordsToSkip: number = (pageNumber-1 || 0) * per_page;
      const noOfRecordsToTake: number = Number(per_page);
      const nfts = await nFT.findMany({
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
        orderBy: { createdAt: 'desc' },
      });
      return res.send({
        pageSize: per_page,
        currentPage: pageNumber,
        totalPages: await nFT.count(),
        data:nfts
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  };

  public fetchNftNoAuth = async (req: Request, res: Response) => {
    try {
    const { id: nftId } = req.params;
    const nftObj = await nFT.findFirst({
      where: { id: nftId },
      include: {
        collection: {
          select: {
            collectionName: true,
          },
        },
        _count: {
          select: {
            revisions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (nftObj === undefined || nftObj === null) {
      return res.status(400).send({ code: 'MII', message: 'Invalid NFT id' });
    }
 
    return res.send({...nftObj, contractAddress: "...Updating"});
    } catch (error) {
      return res.sendStatus(500);
    }
  }

  public fetchNFTRevisions = async (req: RequestWithUser, res: Response) => {
    const { id: nftId } = req.params;
    const appAuthVerification = await nftsHelperServiceObj.getappAuthObj(req.headers.authorization);

    if(appAuthVerification.status==false || appAuthVerification.isError )
        return res.status(403).send({ code: 'IAT', message: 'Invalid Auth Token' });

    let { perPage, pageNumber }: Pagination = req.query || {};
    let per_page: number = (perPage || 10) > 50 ? 50 : (perPage || 10);
    const noOfRecordsToSkip: number = (pageNumber-1 || 0) * per_page;
    const noOfRecordsToTake: number = Number(per_page);

    const nFTRevisionObj = await nFTRevision.findMany({
      where: { nftId },
      orderBy: { createdAt: 'desc' },
      skip: noOfRecordsToSkip,
      take: noOfRecordsToTake,
    });

    if (nFTRevisionObj === undefined || nFTRevisionObj === null) {
      return res.status(400).send({ code: 'MII', message: 'Invalid NFT id' });
    }

    const nFTRevisionCounter = await nFTRevision.findMany({
      where: { nftId }
    });

    return res.send({
      pageSize: per_page,
      currentPage: pageNumber,
      totalPages: nFTRevisionCounter.length,
      data:nFTRevisionObj
    });
  };

  public fetchNFTRevisionsNoAuth = async (req: Request, res: Response) => {
    // @todo validate req
    const { id: nftId } = req.params;

    let { perPage, pageNumber }: Pagination = req.query || {};
    let per_page: number = (perPage || 10) > 50 ? 50 : (perPage || 10);
    const noOfRecordsToSkip: number = (pageNumber-1 || 0) * per_page;
    const noOfRecordsToTake: number = Number(per_page);
    
    const nftObj = await nFTRevision.findMany({
      where: { nftId },
      orderBy: { createdAt: 'desc' },
      skip: noOfRecordsToSkip,
      take: noOfRecordsToTake,
    });

    if (nftObj === undefined || nftObj === null) {
      return res.status(400).send({ code: 'MII', message: 'Invalid NFT id' });
    }

    const nFTRevisionCounter = await nFTRevision.findMany({
      where: { nftId }
    });
 
    return res.send({
      pageSize: per_page,
      currentPage: pageNumber,
      totalPages: nFTRevisionCounter.length,
      data:nftObj
    });
  };
}

export default NFTsController;
