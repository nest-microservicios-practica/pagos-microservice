import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNumber, IsPositive, IsString, ValidateNested } from 'class-validator';

// muestra error porque coloque esModuleInterop, para solventar un error que ocurria con Stripe en el archivo pagos.service.ts, 
export class PagoSessionDto {
    @IsString()
    pedidoId: string;


    @IsString()
    currency: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => PaymentSessionItemDto)
    items: PaymentSessionItemDto[] = [];
}



export class PaymentSessionItemDto {

    @IsString()
    name: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsNumber()
    @IsPositive()
    quantity: number;



}