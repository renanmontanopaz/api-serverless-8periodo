import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { StatusPedido } from '@prisma/client';
import {CreatePedidoDto} from "./create-pedido.dto";
import {PedidoDto} from "./pedido.dto";

@Injectable()
export class PedidosService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createPedidoDto: CreatePedidoDto): Promise<PedidoDto> {
        const { cliente, email, itens } = createPedidoDto;

        // Calcula o total do pedido
        const total = itens.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

        // Cria o pedido no banco de dados
        const pedido = await this.prisma.pedido.create({
            data: {
                cliente,
                email,
                total,
                itens: itens as any, // Ajuste o tipo conforme necessário, ou crie registros ItemPedido relacionados.
                // status é PENDENTE por padrão, conforme definido no schema
            },
        });

        return {
            id: pedido.id,
            cliente: pedido.cliente,
            email: pedido.email,
            itens: pedido.itens, // Ajuste conforme necessário
            total: pedido.total,
            status: pedido.status,
            data_criacao: pedido.data_criacao,
        };
    }

    async findAll(): Promise<PedidoDto[]> {
        const pedidos = await this.prisma.pedido.findMany({
            select: {
                id: true,
                cliente: true,
                email: true,
                itens: true,
                total: true,
                status: true,
                data_criacao: true,
            },
        });

        return pedidos.map(pedido => ({
            id: pedido.id,
            cliente: pedido.cliente,
            email: pedido.email,
            itens: pedido.itens,
            total: pedido.total,
            status: pedido.status,
            data_criacao: pedido.data_criacao,
        }));
    }
}