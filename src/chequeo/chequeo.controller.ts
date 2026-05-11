import { Controller, Get } from '@nestjs/common';

// esta ruta es la que se utiliza para verificar que el portal de pagos está funcionando correctamente,
// es decir, que el microservicio de gateway está funcionando correctamente,

// esta ruta es necesaria para que servicios externos validen que el microservicio de pagos está funcionando correctamente, ejemplo google cloud
// esto se recomienda hacer en todos los microservicios que tengan una url que pueda ser accedida desde el exterior, para que servicios externos puedan validar que el microservicio está funcionando correctamente

// Para que esta ruta ande bien, la configuramos en el main.ts. debe ser una ruta que no retorne un error de ningun tipo, ni 404 ni nada de eso
@Controller('/')
export class ChequeoController {

  @Get()
  ChequeoDeSalud() {
    return '¡El cliente-gateway está en funcionamiento!';
  }
}