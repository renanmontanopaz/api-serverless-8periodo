-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('PENDENTE', 'PROCESSANDO', 'ENVIADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "pedidos" (
    "id" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "itens" JSONB[],
    "total" DOUBLE PRECISION NOT NULL,
    "status" "StatusPedido" NOT NULL DEFAULT 'PENDENTE',
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualiza" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);
