import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnswerOptionDto } from '../common/data/dto/create-answer-option.dto';
import { IdDto } from '../common/data/dto/id.dto';
import { paginateAndMap } from '../common/utils/paginate-and-map.util';
import { QueryParamsDto } from '../common/data/dto/query-params.dto';
import { AnswerOptionModel } from '../common/data/models/answer-option.model';
import { AnswerOptionDto, AnswerOptionWithQuestionDto } from '../common/data/dto/answer-option.dto';
import { UpdateAnswerOptionTextDto } from '../common/data/dto/update-answer-option-text.dto';

@Injectable()
export class AnswerOptionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryParamsDto) {
    return paginateAndMap<AnswerOptionModel, AnswerOptionDto>(
      this.prisma,
      'answerOption',
      query,
      (option) => ({
        id: option.id,
        questionId: option.questionId,
        text: option.text,
        createdAt: option.createdAt,
        updatedAt: option.updatedAt,
      })
    )
  }

  async findAllWithQuestionDto(query: QueryParamsDto) {
    return paginateAndMap(
      this.prisma,
      'answerOption',
      query,
      (option: AnswerOptionWithQuestionDto) => ({
        id: option.id,
        question: {
          id: option.question.id,
          text: option.question.text,
        },
        text: option.text,
        createdAt: option.createdAt,
        updatedAt: option.updatedAt,
      }),
      {
        question: true,
      }
    )
  }

  async create(dto: CreateAnswerOptionDto): Promise<IdDto> {
    const answerOption = await this.prisma.answerOption.create({
      data: {
        questionId: dto.questionId,
        text: dto.text,
      },
    });

    return { id: answerOption.id }
  }

  async findOne(id: string) {
    const answerOption = await this.prisma.answerOption.findUnique({ where: { id } });
    if (!answerOption) throw new NotFoundException(`Answer option with id ${id} not found`);
    return answerOption;
  }

  async findOneWithQuestionDto(id: string) {
    const answerOption = await this.prisma.answerOption.findUnique({
      where: { id },
      include: {
        question: true,
      }
    });
    if (!answerOption) throw new NotFoundException(`Answer option with id ${id} not found`);
    return answerOption;
  }

  async updateText(answerOptionId: string, dto: UpdateAnswerOptionTextDto): Promise<IdDto> {
    try {
      const updated = await this.prisma.answerOption.update({
        where: { id: answerOptionId },
        data: {
          ...(dto.text && { text: dto.text }),
        }
      })

      return { id: updated.id }
    } catch(error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Answer option with id ${answerOptionId} not found`);
      }
      throw error;
    }
  }

  async delete(answerOptionId: string) {
    await this.prisma.answerOption.delete({ where: { id: answerOptionId } });
  }
}
