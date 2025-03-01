import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { StatusPedido } from '@prisma/client';
import { CreatePedidoDto } from './create-pedido.dto';
import { PedidoDto } from './pedido.dto';
import { UpdatePedidoStatusDto } from './update-pedido-status.dto';

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPedidoDto: CreatePedidoDto): Promise<PedidoDto> {
    const { cliente, email, itens } = createPedidoDto;

    const total = itens.reduce(
      (sum, item) => sum + item.preco * item.quantidade,
      0,
    );

    const pedido = await this.prisma.pedido.create({
      data: {
        cliente,
        email,
        total,
        itens: itens as any,
      },
    });

    return {
      id: pedido.id,
      cliente: pedido.cliente,
      email: pedido.email,
      itens: pedido.itens,
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

    return pedidos.map((pedido) => ({
      id: pedido.id,
      cliente: pedido.cliente,
      email: pedido.email,
      itens: pedido.itens,
      total: pedido.total,
      status: pedido.status,
      data_criacao: pedido.data_criacao,
    }));
  }

  async findOne(id: string): Promise<PedidoDto> {
    const pedido = await this.prisma.pedido.findUnique({
      where: {
        id: id,
      },
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    return {
      id: pedido.id,
      cliente: pedido.cliente,
      email: pedido.email,
      itens: pedido.itens,
      total: pedido.total,
      status: pedido.status,
      data_criacao: pedido.data_criacao,
    };
  }

  async updateStatus(
    id: string,
    updatePedidoStatusDto: UpdatePedidoStatusDto,
  ): Promise<{ message: string; status: StatusPedido }> {
    const { status } = updatePedidoStatusDto;

    try {
      const pedidoAtualizado = await this.prisma.pedido.update({
        where: {
          id: id,
        },
        data: {
          status: status,
        },
      });

      return {
        message: 'Pedido atualizado com sucesso',
        status: pedidoAtualizado.status,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.pedido.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
      }
      throw error;
    }
  }
}
