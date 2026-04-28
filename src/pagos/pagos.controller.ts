import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagoSessionDto } from './dto/pago-session.dto';
import { Request, Response } from 'express';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) { }

  @Post('create-pago-session')
  createPagoSession(@Body() pagoSessionDto: PagoSessionDto) {
    // return pagoSessionDto;
    return this.pagosService.createPagoSession(pagoSessionDto);
  }


  // este es el endpoint que llamara stripe para notificar que el pago se realizo con exito
  @Get('success')
  success() {
    return {
      ok: true,
      'message': 'pago exitoso - success',
    }
  }

  @Get('cancel')
  cancel() {
    return {
      ok: false,
      'message': 'pago cancelado - cancel',
    }
  }


  // @Post('webhook')
  // async stripeWebhook() {
  //   return {
  //     'message': 'procesando webhook de Stripe - stripeWebhook',
  //   }
  // }

  @Post('webhook')
  async stripeWebhook(@Req() req: Request, @Res() res: Response) {
    return this.pagosService.stripeWebhook(req, res);
  }

}
