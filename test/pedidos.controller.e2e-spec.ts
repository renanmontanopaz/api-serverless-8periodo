import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { StatusPedido } from '@prisma/client';
import {PedidosService} from "../src/module/pedido/pedido.service";
import {PrismaService} from "../src/module/prisma/prisma.service";
import {PedidosModule} from "../src/module/pedido/pedido.module";
import {CreatePedidoDto} from "../src/module/pedido/create-pedido.dto";
import {AppModule} from "../src/app.module";
import {App} from "supertest/types";

describe('PedidosController (e2e)', () => {
    let app: INestApplication<App>;
    let pedidosService: PedidosService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [PedidosModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        pedidosService = moduleFixture.get<PedidosService>(PedidosService);
        prismaService = moduleFixture.get<PrismaService>(PrismaService);

        // Limpar o banco de dados antes de cada teste (opcional, mas recomendado)
        await prismaService.$executeRaw`DELETE FROM "api-serverless"."pedidos";`;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /pedidos', () => {
        it('should create a new pedido', async () => {
            const createPedidoDto: CreatePedidoDto = {
                cliente: 'Teste Cliente',
                email: 'teste@example.com',
                itens: [{ produto: 'Teste Produto', quantidade: 1, preco: 10 }],
            };

            const response = await request(app.getHttpServer())
                .post('/pedidos')
                .send(createPedidoDto)
                .expect(201);

            expect(response.body.id).toBeDefined();
            expect(response.body.cliente).toEqual(createPedidoDto.cliente);
            expect(response.body.status).toEqual(StatusPedido.PENDENTE);
        });
    });

    describe('GET /pedidos', () => {
        it('should return an array of pedidos', async () => {
            // Crie alguns pedidos no banco de dados para testar
            await prismaService.pedido.create({
                data: {
                    cliente: 'Teste Cliente 1',
                    email: 'teste1@example.com',
                    total: 10,
                    itens: [{ produto: 'Teste Produto 1', quantidade: 1, preco: 10 }] as any,
                },
            });

            await prismaService.pedido.create({
                data: {
                    cliente: 'Teste Cliente 2',
                    email: 'teste2@example.com',
                    total: 20,
                    itens: [{ produto: 'Teste Produto 2', quantidade: 2, preco: 10 }] as any,
                    status: StatusPedido.ENVIADO,
                },
            });

            const response = await request(app.getHttpServer()).get('/pedidos').expect(200);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('GET /pedidos/:id', () => {
        it('should return a pedido by id', async () => {
            // Crie um pedido no banco de dados para testar
            const pedidoCriado = await prismaService.pedido.create({
                data: {
                    cliente: 'Teste Cliente',
                    email: 'teste@example.com',
                    total: 10,
                    itens: [{ produto: 'Teste Produto', quantidade: 1, preco: 10 }] as any,
                },
            });

            const response = await request(app.getHttpServer())
                .get(`/pedidos/${pedidoCriado.id}`)
                .expect(200);

            expect(response.body.id).toEqual(pedidoCriado.id);
            expect(response.body.cliente).toEqual(pedidoCriado.cliente);
        });

        it('should return 404 if pedido is not found', async () => {
            const response = await request(app.getHttpServer())
                .get('/pedidos/non-existent-id')
                .expect(404);
        });
    });

    describe('PATCH /pedidos/:id', () => {
        it('should update the status of a pedido', async () => {
            // Crie um pedido no banco de dados para testar
            const pedidoCriado = await prismaService.pedido.create({
                data: {
                    cliente: 'Teste Cliente',
                    email: 'teste@example.com',
                    total: 10,
                    itens: [{ produto: 'Teste Produto', quantidade: 1, preco: 10 }] as any,
                },
            });

            const updatePedidoStatusDto = { status: StatusPedido.ENVIADO };

            const response = await request(app.getHttpServer())
                .patch(`/pedidos/${pedidoCriado.id}`)
                .send(updatePedidoStatusDto)
                .expect(200);

            expect(response.body.status).toEqual(StatusPedido.ENVIADO);

            // Verifique se o status foi realmente atualizado no banco de dados
            const pedidoAtualizado = await prismaService.pedido.findUnique({
                where: { id: pedidoCriado.id },
            });

            if (pedidoAtualizado) {
                expect(pedidoAtualizado.status).toEqual(StatusPedido.ENVIADO);
            } else {
                // Se o pedido não foi encontrado após a atualização, lance um erro ou falhe no teste
                fail('Pedido não encontrado após a atualização.'); // Usando fail do Jest
            }
        });

        it('should return 404 if pedido is not found', async () => {
            const updatePedidoStatusDto = { status: StatusPedido.ENVIADO };
            const response = await request(app.getHttpServer())
                .patch('/pedidos/non-existent-id')
                .send(updatePedidoStatusDto)
                .expect(404);
        });
    });

    describe('DELETE /pedidos/:id', () => {
        it('should delete a pedido', async () => {
            // Crie um pedido no banco de dados para testar
            const pedidoCriado = await prismaService.pedido.create({
                data: {
                    cliente: 'Teste Cliente',
                    email: 'teste@example.com',
                    total: 10,
                    itens: [{ produto: 'Teste Produto', quantidade: 1, preco: 10 }] as any,
                },
            });

            await request(app.getHttpServer())
                .delete(`/pedidos/${pedidoCriado.id}`)
                .expect(204);

            // Verifique se o pedido foi realmente deletado do banco de dados
            const pedidoDeletado = await prismaService.pedido.findUnique({
                where: { id: pedidoCriado.id },
            });
            expect(pedidoDeletado).toBeNull();
        });

        it('should return 404 if pedido is not found', async () => {
            await request(app.getHttpServer())
                .delete('/pedidos/non-existent-id')
                .expect(404);
        });
    });
});