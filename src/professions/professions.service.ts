import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfessionsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findByName(name: string) {
    const profession = await this.prisma.profession.findUnique({ where: { name: name } });

    return profession;
  }
}
