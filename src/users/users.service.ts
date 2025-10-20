import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../common/data/dto/create-user.dto';
import { UserDto } from '../common/data/dto/user.dto';
import { paginateAndMap } from '../common/utils/paginate-and-map.util';
import { UserModel } from '../common/data/models/user.model';
import { QueryParamsDto } from '../common/data/dto/query-params.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    await this.prisma.user.create({
      data: {
        telegramId: dto.telegramId,
        username: dto.username,
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: dto.password,
        phone: dto.phone,
        role: dto.role,
      },
    });
  }

  async findAll(query: QueryParamsDto) {
    return paginateAndMap<UserModel, UserDto>(
      this.prisma,
      'user',
      query,
      (user) => ({
        id: user.id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }),
    );
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    return user;
  }

  async findByTelegramId(telegramId: string) {
    const user = await this.prisma.user.findUnique({
      where: { telegramId: telegramId },
    });
    return user;
  }

  async findByTelegramIdWithTestsAndResults(telegramId: string) {
    const user = await this.prisma.user.findUnique({
      where: { telegramId: telegramId },
      include: {
        tests: {
          include: {
            result: { include: { profession: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return user;
  }
}
