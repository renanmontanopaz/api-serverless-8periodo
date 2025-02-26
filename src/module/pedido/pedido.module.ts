import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {PedidosController} from "./pedido.controller";
import {PedidosService} from "./pedido.service";

@Module({
    controllers: [PedidosController],
    providers: [PedidosService, PrismaService],
})
export class PedidosModule {}