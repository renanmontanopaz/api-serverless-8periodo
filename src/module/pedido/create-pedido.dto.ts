import { IsNotEmpty, IsEmail, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateItemPedidoDto {
    @IsNotEmpty()
    produto: string;

    @IsNumber()
    quantidade: number;

    @IsNumber()
    preco: number;
}

export class CreatePedidoDto {
    @IsNotEmpty()
    cliente: string;

    @IsEmail()
    email: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateItemPedidoDto)
    itens: CreateItemPedidoDto[];
}