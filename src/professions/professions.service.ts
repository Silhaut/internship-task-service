import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryParamsDto } from '../common/data/dto/query-params.dto';
import { paginateAndMap } from '../common/utils/paginate-and-map.util';
import { ProfessionModel } from '../common/data/models/profession.model';
import { ProfessionDto } from '../common/data/dto/profession.dto';

@Injectable()
export class ProfessionsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll(query: QueryParamsDto) {
    return paginateAndMap<ProfessionModel, ProfessionDto>(
      this.prisma,
      'profession',
      query,
      (profession) => ({
        id: profession.id,
        name: profession.name,
        description: profession.description,
        createdAt: profession.createdAt,
        updatedAt: profession.updatedAt,
      }),
    )
  }

  async findByName(name: string) {
    const profession = await this.prisma.profession.findUnique({ where: { name: name } });

    return profession;
  }
}
