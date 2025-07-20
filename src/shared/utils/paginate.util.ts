import { Prisma, PrismaClient } from "@/generated/prisma";

interface PaginationOptions<T extends Prisma.ModelName> {
  model: T;
  where?: Prisma.TypeMap[T]["operations"]["where"];
  select?: Prisma.TypeMap[T]["operations"]["select"];
  orderBy?: Prisma.TypeMap[T]["operations"]["orderBy"];
  page?: number;
  limit?: number;
  searchFields?: string[];
  searchTerm?: string;
}

interface PaginationResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function paginate<T extends Prisma.ModelName>(
  prisma: PrismaClient,
  options: PaginationOptions<T>
): Promise<PaginationResult<any>> {
  const {
    model,
    where = {},
    select,
    orderBy = { created_at: "desc" },
    page = 1,
    limit = 10,
    searchFields = [],
    searchTerm = "",
  } = options;

  const searchClause =
    searchTerm && searchFields.length > 0
      ? {
          OR: searchFields.map((field) => ({
            [field]: {
              contains: searchTerm,
              mode: "insensitive" as Prisma.QueryMode,
            },
          })),
        }
      : {};

  const whereClause = {
    ...where,
    ...searchClause,
  };

  const [total, data] = await Promise.all([
    prisma[model].count({ where: whereClause }),
    prisma[model].findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
      select,
    }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
