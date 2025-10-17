import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestResultDto } from '../data/dto/create-test-result.dto';

@Injectable()
export class TestResultsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  create(dto: CreateTestResultDto) {
    return this.prisma.result.create({
      data: { testId: dto.testId, professionId: dto.professionId, scoreDetails: dto.scoreDetails },
    });
  }
}
