import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestResultDto } from '../common/data/dto/create-test-result.dto';
import { QueryParamsDto } from '../common/data/dto/query-params.dto';
import { paginateAndMap } from '../common/utils/paginate-and-map.util';
import { TestResultModel } from '../common/data/models/test-result.model';
import { TestResultDto, TestResultWithTestDto } from '../common/data/dto/test-result.dto';

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

  findAll(query: QueryParamsDto) {
    return paginateAndMap<TestResultModel, TestResultDto>(
      this.prisma,
      'result',
      query,
      (result) => ({
        id: result.id,
        testId: result.testId,
        professionId: result.professionId,
        createdAt: result.createdAt,
        updatedAt: result.createdAt
      })
    )
  }

  findAllWithTestAndUserDto(query: QueryParamsDto) {
    return paginateAndMap(
      this.prisma,
      'result',
      query,
      (result: TestResultWithTestDto) => ({
        id: result.id,
        test: {
          id: result.test.id,
          user: {
            id: result.test.user.id,
            username: result.test.user.username,
            telegramId: result.test.user.telegramId,
            firstName: result.test.user.firstName,
            lastName: result.test.user.lastName,
            role: result.test.user.role,
            phone: result.test.user.phone,
          },
        },
        profession: {
          id: result.profession.id,
          name: result.profession.name,
          description: result.profession.description,
        },
        createdAt: result.createdAt,
        updatedAt: result.createdAt
      }),
      {
        test: {
          include: {
            user: true,
          },
        },
        profession: true
      }
    )
  }

  async findOne(id: string) {
    const testResult = await this.prisma.result.findUnique({ where: { id } });
    if (!testResult) throw new NotFoundException(`Test Result with id ${id} not found`);
    return testResult;
  }

  async findOneWithTestAndProfessionDto(id: string) {
    const testResult = await this.prisma.result.findUnique({
      where: { id },
      include: {
        test: true,
        profession: true,
      }
    });
    if (!testResult) throw new NotFoundException(`Test Result with id ${id} not found`);
    return testResult;
  }
}
