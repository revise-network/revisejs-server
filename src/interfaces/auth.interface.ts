import { Request } from 'express';

export interface DataStoredInToken {
  id: string;
}

export interface DataStoredInAuthToken {
  id: string;
  key?: string;
}

export interface TokenData {
  token: string;
}

export interface RequestWithUser extends Request {
  user: {
    id: string;
  };
  params: {
    id?: string;
  }
}
