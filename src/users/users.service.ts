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
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: dto.role,
      }
    })
  }

  async findByTelegramId(telegramId: string) {
    const user = await this.prisma.user.findUnique({ where: { telegramId: telegramId } });
    if (!user) {
      throw new NotFoundException('User not found!');
    }

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
