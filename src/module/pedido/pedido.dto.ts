import { StatusPedido } from '@prisma/client';

export class PedidoDto {
  id: string;
  cliente: string;
  email: string;
  itens: any[]; // Adapte para o tipo correto se você definiu um DTO para ItemPedido
  total: number;
  status: StatusPedido;
  data_criacao: Date;
}
