import { Module } from '@nestjs/common';
import { ChequeoController } from './chequeo.controller';

@Module({
  controllers: [ChequeoController],
})
export class ChequeoModule {}
