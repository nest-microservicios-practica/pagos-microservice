import { Module } from '@nestjs/common';
import { PagosModule } from './pagos/pagos.module';
import { ChequeoModule } from './chequeo/chequeo.module';

@Module({
  imports: [PagosModule, ChequeoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
