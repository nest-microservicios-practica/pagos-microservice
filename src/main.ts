import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

//! ESTE MICROSERVICIO ES HIBRIDO, - TIENE DOS FORMAS DE COMUNICARSE, MEDIANTE HTTP Y MEDIANTE NATS
// ES HIBRIDO PORQUE TIENE ENDPOINTS HTTP PARA QUE STRIPE PUEDA NOTIFICAR CUANDO UN PAGO SE REALIZA CORRECTAMENTE,
// PERO TAMBIEN SE COMUNICA CON EL CLIENTE-GATEWAY A TRAVES DE NATS PARA RECIBIR ORDENES DE PAGO Y ENVIAR RESPUESTAS SOBRE EL ESTADO DE LOS PAGOS
async function bootstrap() {
  const logger = new Logger('PagosMicroservice main');
  const app = await NestFactory.create(AppModule,{
    rawBody: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers,
      },
    },
    {
      inheritAppConfig: true, //! esta opcion hace que el microservicio de pagos pueda compartir la misma configuracion, ejemplo la validacion de DTOS
    }
  );

  // la siguiente linea es para que el microservicio de pagos pueda escuchar tanto por HTTP como por NATS, 
  await app.startAllMicroservices();


  await app.listen(envs.port ?? 3000);
  logger.log(`Microservicio de pagos escuchando en el puerto ${envs.port ?? 3000}`);
}
bootstrap();
