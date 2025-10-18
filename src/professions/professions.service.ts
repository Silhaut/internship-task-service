import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryParamsDto } from '../common/data/dto/query-params.dto';
import { paginateAndMap } from '../common/utils/paginate-and-map.util';
import { ProfessionModel } from '../common/data/models/profession.model';
import { ProfessionDto } from '../common/data/dto/profession.dto';
import { CreateProfessionDto } from '../common/data/dto/create-profession.dto';
import { IdDto } from '../common/data/dto/id.dto';

@Injectable()
export class ProfessionsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(dto: CreateProfessionDto): Promise<IdDto> {
    const profession = await this.prisma.profession.create({
      data: {
        name: dto.name,
        description: dto.description,
      }
    })
    
    return { id: profession.id };
  }

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
