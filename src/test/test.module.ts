import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TestUpdate } from './test.update';

@Module({
  providers: [TestUpdate, PrismaService],
})
export class TestModule {}
