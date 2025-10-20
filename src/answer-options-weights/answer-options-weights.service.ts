import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnswerOptionWeightDto } from '../common/data/dto/create-answer-option-weight.dto';
import { IdDto } from '../common/data/dto/id.dto';
import { QueryParamsDto } from '../common/data/dto/query-params.dto';
import { paginateAndMap } from '../common/utils/paginate-and-map.util';
import { AnswerOptionWeightModel } from '../common/data/models/answer-option-weight.model';
import { AnswerOptionWeightDto } from '../common/data/dto/answer-option-weight.dto';
import { UpdateOptionWeightDto } from '../common/data/dto/update-option-weight.dto';

@Injectable()
export class AnswerOptionsWeightsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAnswerOptionWeightDto): Promise<IdDto> {
    const answerOptionWeight = await this.prisma.answerOptionWeight.create({
      data: {
        answerOptionId: dto.answerOptionId,
        professionId: dto.professionId,
        weight: dto.weight,
      },
    });

    return { id: answerOptionWeight.id };
  }

  findAll(query: QueryParamsDto) {
    return paginateAndMap<AnswerOptionWeightModel, AnswerOptionWeightDto>(
      this.prisma,
      'answerOptionWeight',
      query,
      (optionWeight) => ({
        id: optionWeight.id,
        answerOptionId: optionWeight.answerOptionId,
        professionId: optionWeight.id,
        weight: optionWeight.weight,
        createdAt: optionWeight.createdAt,
        updatedAt: optionWeight.createdAt,
      }),
    );
  }

  async findOne(id: string) {
    const optionWeight = await this.prisma.answerOptionWeight.findUnique({
      where: { id },
    });
    if (!optionWeight)
      throw new NotFoundException(
        `Answer Option Weight with id ${id} not found`,
      );
    return optionWeight;
  }

  async findOneWithAnswerOptionAdnProfession(id: string) {
    const optionWeight = await this.prisma.answerOptionWeight.findUnique({
      where: { id },
      include: {
        answerOption: {
          include: {
            question: true
          }
        },
        profession: true,
      }
    });
    if (!optionWeight)
      throw new NotFoundException(
        `Answer Option Weight with id ${id} not found`,
      );
    return optionWeight;
  }

  async update(id: string, dto: UpdateOptionWeightDto): Promise<IdDto> {
    try {
      const updated = await this.prisma.answerOptionWeight.update({
        where: { id },
        data: {
          ...(dto.weight && { weight: dto.weight }),
        },
      });

      return { id: updated.id };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Answer Option Weight with id "${id}" not found`,
        );
      }
      throw error;
    }
  }

  async delete(id: string) {
    await this.prisma.answerOptionWeight.delete({ where: { id } });
  }
}
