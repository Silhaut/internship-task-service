import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QuestionModel } from '../common/data/models/question.model';
import { IdDto } from '../common/data/dto/id.dto';
import { CreateQuestionDto } from '../common/data/dto/create-question.dto';
import { QueryParamsDto } from '../common/data/dto/query-params.dto';
import { paginateAndMap } from '../common/utils/paginate-and-map.util';
import { QuestionDto } from '../common/data/dto/question.dto';

type Question = {
  answerOptions: Option[];
} & QuestionModel;

type Option = {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  questionId: string;
};

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  findAll(query: QueryParamsDto) {
    return paginateAndMap<QuestionModel, QuestionDto>(
      this.prisma,
      'question',
      query,
      (question) => ({
        id: question.id,
        text: question.text,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      }),
    );
  }

  async findOne(questionId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question)
      throw new NotFoundException(`Question with id ${questionId} not found`);
    return question;
  }

  async create(dto: CreateQuestionDto): Promise<IdDto> {
    const question = await this.prisma.question.create({
      data: {
        text: dto.text,
      },
    });

    return { id: question.id };
  }

  async update(questionId: string, dto: CreateQuestionDto): Promise<IdDto> {
    try {
      const updated = await this.prisma.question.update({
        where: { id: questionId },
        data: {
          ...(dto.text && { text: dto.text }),
        },
      });

      return { id: updated.id };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Question with id "${questionId}" not found`,
        );
      }
      throw error;
    }
  }

  async delete(questionId: string) {
    await this.prisma.question.delete({ where: { id: questionId } });
  }

  async findMany(): Promise<Pick<Question, 'id' | 'text' | 'answerOptions'>[]> {
    const question = await this.prisma.question.findMany({
      include: { answerOptions: true },
      orderBy: { createdAt: 'asc' },
    });

    return question;
  }

  async findOneWithAnswerOptions(questionId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: { answerOptions: true }
    });
    if (!question) throw new NotFoundException(`Question with id ${questionId} not found`);
    return question;
  }
}
