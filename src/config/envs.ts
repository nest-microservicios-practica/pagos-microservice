import * as joi from "joi";
import 'dotenv/config';

interface EnvVariables {
  PORT: number;
  STRIPE_SECRET_KEY: string;
  STRIPE_ENDPOINT_SECRET: string;
  STRIPE_SUCCESS_URL: string;
  STRIPE_CANCEL_URL: string;
  // NATS_SERVERS: string[];
}

const envSchema = joi.object({
  PORT: joi.number().required(),
  STRIPE_SECRET_KEY: joi.string().required(),
  STRIPE_ENDPOINT_SECRET: joi.string().required(),
  STRIPE_SUCCESS_URL: joi.string().required(),
  STRIPE_CANCEL_URL: joi.string().required(),
  // NATS_SERVERS: joi.array().items(joi.string()).min(1).required(),
}).unknown(true);

const { error, value } = envSchema.validate({
  ...process.env,
  // NATS_SERVERS: process.env.NATS_SERVERS?.split(','), // esto lo hacemos para que lo pueda validar como un array, ya que no lo es
});

if (error) {
    const mensajes = error.details
        .map((issue) => `- ${issue.path.join('.')}: ${issue.message}`)
        .join('\n');
    console.log('**** ERROR DE VARIABLES DE ENTORNO ****');
    console.log(mensajes);
  throw new Error(
      `Variables de entorno inválidas: ${error.message}`,
    );
}
const envVars: EnvVariables = value;

export const envs = {
  port: envVars?.PORT,
  stripeSecretKey: envVars?.STRIPE_SECRET_KEY,
  stripeEndpointSecret: envVars?.STRIPE_ENDPOINT_SECRET,
  stripeSuccessUrl: envVars?.STRIPE_SUCCESS_URL,
  stripeCancelUrl: envVars?.STRIPE_CANCEL_URL,
  // natsServers: envVars?.NATS_SERVERS,
};
