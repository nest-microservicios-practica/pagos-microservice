import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import { PagoSessionDto } from './dto/pago-session.dto';
import { Request, Response } from 'express';
const stripe = require('stripe')(envs.stripeSecretKey);
// fuente https://docs.stripe.com/sdks/server-side
// url para listar mi endpoint de webhook en Stripe https://dashboard.stripe.com/webhooks
// https://dashboard.stripe.com/acct_1TQwcI0FYG0LWgMf/test/workbench/webhooks/we_1TRE680FYG0LWgMfy4Q0ODXP?fromWizard=true



//! si sirve de algo , tripe ofrece la tarjeta 4242424242424 y asi sucesivamente para hacer pruebas de pagos exitosos, fallidos, etc, sin necesidad de usar una tarjeta real, lo cual es muy util para el desarrollo y testing de la aplicacion. https://stripe.com/docs/testing#cards
@Injectable()
export class PagosService {

    // este metodo se encarga de crear una session de pago en Stripe, es decir, crear un pago en Stripe y obtener la url de pago para redirigir al usuario a esa url y que pueda realizar el pago. tipo webpay transbank
    async createPagoSession(pagoSessionDto: PagoSessionDto) {

        const { pedidoId, currency, items } = pagoSessionDto;
        const lineItems = items.map(item => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100), // se multiplica por 100 porque Stripe espera el precio en centavos, es decir, si el precio es 10.00 USD, se le envia 1000 centavos
            },
            quantity: item.quantity,
        }));




        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            // lo siguiente es para saber quien esta pagando y que esta pagando
            payment_intent_data: {
                metadata: {
                    // userId: '1234567890',
                    pedidoId: pedidoId,
                }
            },
            line_items: lineItems,
            mode: 'payment',
            // lo siguiente deberia de ser variables de entorno, pero por simplicidad las dejo hardcodeadas
            success_url: envs.stripeSuccessUrl, // a donde se redirige al usuario despues de que el pago se realizo con exito
            cancel_url: envs.stripeCancelUrl, // a donde se redirige al usuario despues de que el pago se cancelo o no se realizo con exito
        });
        return session;
    }



    // esto es el metodo que se encarga de procesar el webhook de Stripe, es decir, recibir la notificacion de Stripe cuando el pago se realizo con exito y actualizar el estado del pedido en la base de datos
    // aqui tenemos los eventos, de si el usuario pago, si cancelo el pago, si el pago fallo, etc, y dependiendo del evento que recibamos, actualizamos el estado del pedido en la base de datos
    async stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];

    let event: any;

    // Real
    const endpointSecret = envs.stripeEndpointSecret;

    try {
      event = stripe.webhooks.constructEvent(
        req['rawBody'], // este rawBody lo que hace es obtener el cuerpo de la peticion tal cual como lo envio Stripe, sin parsearlo, porque Stripe necesita verificar la firma de la peticion y si el cuerpo ya esta parseado, la firma no va a ser valida
        sig,
        endpointSecret,
      );
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    
    switch( event.type ) {
      case 'charge.succeeded': 
        const chargeSucceeded = event.data.object;
        // TODO: llamar nuestro microservicio
        console.log({
          metadata: chargeSucceeded.metadata,
          pedidoId: chargeSucceeded.metadata.pedidoId,
        });
      break;
      
      default:
        console.log(`Event ${ event.type } not handled`);
    }

    return res.status(200).json({ sig });
  }
}
