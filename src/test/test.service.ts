import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}

  create(userId: string) {
    return this.prisma.test.create({ data: { userId: userId } });
  }
}
