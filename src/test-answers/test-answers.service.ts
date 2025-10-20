import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestAnswerDto } from '../common/data/dto/create-test-answer.dto';
import { QueryParamsDto } from '../common/data/dto/query-params.dto';
import { paginateAndMap } from '../common/utils/paginate-and-map.util';
import { TestAnswerModel } from '../common/data/models/test-answer.model';
import { TestAnswerDto, TestAnswerWithTestAndQuestionAndAnswerDto } from '../common/data/dto/test-answer.dto';

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

  findAll(query: QueryParamsDto) {
    return paginateAndMap<TestAnswerModel, TestAnswerDto>(
      this.prisma,
      'testAnswer',
      query,
      (testAnswer) => ({
        id: testAnswer.id,
        testId: testAnswer.testId,
        questionId: testAnswer.questionId,
        answerId: testAnswer.answerId
      })
    )
  }

  findAllWithTestAndQuestionAndAnswer(query: QueryParamsDto) {
    return paginateAndMap(
      this.prisma,
      'testAnswer',
      query,
      (testAnswer: TestAnswerWithTestAndQuestionAndAnswerDto) => ({
        id: testAnswer.id,
        test: {
          id: testAnswer.test.id,
          user: {
            id: testAnswer.test.user.id,
            telegramId: testAnswer.test.user.telegramId,
            username: testAnswer.test.user.username,
            firstName: testAnswer.test.user.firstName,
            lastName: testAnswer.test.user.lastName,
            phone: testAnswer.test.user.phone,
            role: testAnswer.test.user.role,
          },
        },
        question: {
          id: testAnswer.question.id,
          text: testAnswer.question.text,
        },
        answer: {
          id: testAnswer.answer.id,
          text: testAnswer.answer.text,
        }
      }),
      {
        test: {
          include: {
            user: true,
          }
        },
        question: true,
        answer: true,
      }
    )
  }

  async findOne(id: string) {
    const testAnswer = await this.prisma.testAnswer.findUnique({ where: { id } });
    if (!testAnswer) throw new NotFoundException(`Test Answer with id ${id} not found`);
    return testAnswer;
  }

  async findOneWithTestAndQuestionAndAnswer(id: string) {
    const testAnswer = await this.prisma.testAnswer.findUnique({
      where: { id },
      include: {
        test: {
          include: {
            user: true,
          }
        },
        question: true,
        answer: true,
      }
    });
    if (!testAnswer) throw new NotFoundException(`Test Answer with id ${id} not found`);
    return testAnswer;
  }
}
