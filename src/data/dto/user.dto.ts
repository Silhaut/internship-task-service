import { UserModel } from '../models/user.model';

export type UserDto = Pick<UserModel, 'telegramId'
    | 'id'
    | 'username'
    | 'firstName'
    | 'lastName'
    | 'phone'
    | 'createdAt'
    | 'updatedAt'
    | 'role'>