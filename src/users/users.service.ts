import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../data/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
  ) {}

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
      }
    })
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username: username } });
    return user;
  }

  async findByTelegramId(telegramId: string) {
    const user = await this.prisma.user.findUnique({ where: { telegramId: telegramId } });
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
    })

    return user;
  }
}
