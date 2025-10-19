import { QueryParamsDto } from '../data/dto/query-params.dto';

export async function paginateAndMap<T, D>(
  prisma: any,
  modelKey: string,
  query: QueryParamsDto,
  mapFn: (entity: T) => D,
  include?: Record<string, boolean | object>,
) {
  const { buildPrismaQuery } = await import('./prisma-query.util');
  const prismaQuery = buildPrismaQuery(query);

  const queryWithRelations = include
    ? { ...prismaQuery, include }
    : prismaQuery;

  const model = prisma[modelKey];

  const [data, totalSize] = await prisma.$transaction([
    model.findMany(queryWithRelations),
    model.count({ where: prismaQuery.where }),
  ]);

  return {
    data: data.map(mapFn),
    totalSize,
    page: Number(query.page ?? 1),
    size: Number(query.size ?? 20),
    totalPage: Math.ceil(totalSize / Number(query.size ?? 20)),
  };
}
