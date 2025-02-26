import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusPedido } from '@prisma/client';

export class UpdatePedidoStatusDto {
    @IsNotEmpty()
    @IsEnum(StatusPedido)
    status: StatusPedido;
}