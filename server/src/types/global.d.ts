export interface RequestUser {
  id: number;
  email: string;
  name?: string;
  img?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date; 
  token: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}
