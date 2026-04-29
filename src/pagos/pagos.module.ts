import { Module } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [PagosController],
  providers: [PagosService],
  imports: [
    NatsModule // esto para poder comunicarme con otros microservicios que esten registrados en NATS, como el microservicio de pedidos
  ]
})
export class PagosModule {}
