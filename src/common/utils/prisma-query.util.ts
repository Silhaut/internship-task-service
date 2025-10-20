import { QueryParamsDto } from '../data/dto/query-params.dto';

export function buildPrismaQuery(params: QueryParamsDto) {
  const {
    page = '1',
    size = '20',
    sort,
    order = 'asc',
    ...filters
  } = params;

  const take = Number(size);
  const skip = (Number(page) - 1) * take;

  const where: Record<string, any> = {};

  const OPERATORS = ['equals', 'not', 'in', 'notIn', 'lt', 'lte', 'gt', 'gte', 'contains', 'startsWith', 'endsWith'];

  const ENUM_FIELDS = ['role', 'status'];

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '') continue;

    // 1. Проверяем, есть ли оператор: например age[gte]
    const match = key.match(/^(\w+)\[(\w+)\]$/);
    if (match) {
      const [, field, op] = match;
      if (!where[field]) where[field] = {};

      if (op === 'in' || op === 'notIn') {
        where[field][op] = String(value)
          .split(',')
          .map((v) => v.trim());
      } else if (OPERATORS.includes(op)) {
        // для дат
        if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
          where[field][op] = new Date(`${value}T00:00:00.000Z`);
        } else if (!isNaN(Number(value))) {
          where[field][op] = Number(value);
        } else {
          where[field][op] = value;
        }
      }
      continue;
    }

    // 2. Если это дата в формате YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
      const start = new Date(`${value}T00:00:00.000Z`);
      const end = new Date(start);
      end.setDate(start.getDate() + 1);
      where[key] = { gte: start, lt: end };
      continue;
    }

    // 3. Если это ENUM поле
    if (ENUM_FIELDS.includes(key)) {
      where[key] = value;
      continue;
    }

    // 4. Если значение содержит запятые — возможно, это список
    if (typeof value === 'string' && value.includes(',')) {
      where[key] = { in: value.split(',').map((v) => v.trim()) };
      continue;
    }

    // 5. Если это строка — регистронезависимый contains
    if (typeof value === 'string') {
      where[key] = { contains: value, mode: 'insensitive' };
      continue;
    }

    // 6. Числа и булевые
    if (!isNaN(Number(value))) {
      where[key] = Number(value);
      continue;
    }
    if (value === 'true' || value === 'false') {
      where[key] = value === 'true';
      continue;
    }

    // fallback
    where[key] = value;
  }

  const orderBy = sort
    ? { [sort]: order.toLowerCase() === 'desc' ? 'desc' : 'asc' }
    : undefined;

  return { skip, take, where, orderBy };
}
