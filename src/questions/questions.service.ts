import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QuestionModel } from '../common/data/models/question.model';

type Question = {
  answerOptions: Option[]
} & QuestionModel

type Option = {
  id: string
  text: string
  createdAt: Date,
  updatedAt: Date,
  questionId: string
}

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async findMany(): Promise<Pick<Question, 'id' | 'text' | 'answerOptions'>[]> {
    const question = await this.prisma.question.findMany({
      include: { answerOptions: true },
      orderBy: { createdAt: 'asc' },
    })

    return question;
  }
}
