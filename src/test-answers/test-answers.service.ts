import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestAnswerDto } from '../data/dto/create-test-answer.dto';

@Injectable()
export class TestAnswersService {
  constructor(
    private prisma: PrismaService,
  ) {}

  create(dto: CreateTestAnswerDto) {
    return this.prisma.testAnswer.create({
      data: {
        testId: dto.testId,
        questionId: dto.questionId,
        answerId: dto.answerId,
      }
    })
  }

  async findMany(testId: string) {
    const answers = this.prisma.testAnswer.findMany({
      where: { testId },
      include: { answer: { include: { weights: { include: { profession: true } } } } },
    })

    return answers;
  }
}
