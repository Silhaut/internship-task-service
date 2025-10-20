import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminOverviewDto } from './admin-overview.dto';

@Roles(Role.ADMIN)
@ApiBearerAuth()
@Controller({
  version: '1',
  path: 'admin'
})
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get global admin dashboard stats' })
  @ApiResponse({ type: AdminOverviewDto })
  async getOverview(): Promise<AdminOverviewDto> {
    const [
      users,
      tests,
      questions,
      professions,
      testResults
    ] = await Promise.all([
      this.prisma.user.findMany(),
      this.prisma.test.findMany({
        include: {
          user: true,
          result: { include: { profession: true } },
        },
      }),
      this.prisma.question.findMany({ include: { answerOptions: true } }),
      this.prisma.profession.findMany(),
      this.prisma.result.findMany({ include: { profession: true } }),
    ]);

    const completed = tests.filter((t) => t.result !== null).length;
    const inProgress = tests.length - completed;

    const topProfessions = Object.entries(
      testResults.reduce((acc, r) => {
        const p = r.profession.name;
        acc[p] = (acc[p] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    )
      .map(([profession, count]) => ({ profession, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      users: {
        total: users.length,
        byRole: {
          ADMIN: users.filter((u) => u.role === 'ADMIN').length,
          USER: users.filter((u) => u.role === 'USER').length,
        },
        latest: users
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, 5)
          .map((u) => ({
            id: u.id,
            username: u.username,
            firstName: u.firstName,
            lastName: u.lastName,
            createdAt: u.createdAt,
          })),
      },
      tests: {
        total: tests.length,
        completed,
        inProgress,
        topProfessions,
        latest: tests
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, 5)
          .map((t) => ({
            id: t.id,
            user: {
              id: t.user.id,
              username: t.user.username,
              firstName: t.user.firstName,
              lastName: t.user.lastName,
              createdAt: t.user.createdAt,
            },
            profession: t.result?.profession?.name ?? '—',
            createdAt: t.createdAt,
          })),
      },
      questions: {
        total: questions.length,
        totalAnswers: questions.reduce(
          (acc, q) => acc + q.answerOptions.length,
          0,
        ),
        avgAnswersPerQuestion:
          questions.reduce((acc, q) => acc + q.answerOptions.length, 0) /
          questions.length,
      },
      professions: {
        total: professions.length,
        mostCommon: topProfessions[0]?.profession ?? 'N/A',
      },
    };
  }
}
