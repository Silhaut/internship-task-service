import 'express';
import { JwtPayloadDto } from '../data/dto/jwt-payload.dto';

type User = Pick<JwtPayloadDto, 'user'>

declare module 'express' {
  export interface Request {
    user?: User;
  }
}
