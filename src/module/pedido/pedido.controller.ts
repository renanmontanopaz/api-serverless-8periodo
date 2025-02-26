import {Controller, Post, Body, HttpCode, HttpStatus, Get, Param, Patch, Delete} from '@nestjs/common';
import {PedidosService} from "./pedido.service";
import {CreatePedidoDto} from "./create-pedido.dto";
import {PedidoDto} from "./pedido.dto";
import {UpdatePedidoStatusDto} from "./update-pedido-status.dto";
import {StatusPedido} from "@prisma/client";


@Controller('pedidos')
export class PedidosController {
    constructor(private readonly pedidosService: PedidosService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createPedidoDto: CreatePedidoDto): Promise<PedidoDto> {
        return this.pedidosService.create(createPedidoDto);
    }

    @Get()
    async findAll(): Promise<PedidoDto[]> {
        return this.pedidosService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<PedidoDto> {
        return this.pedidosService.findOne(id);
    }

    @Patch(':id') // Rota com parâmetro
    async updateStatus(
        @Param('id') id: string,
        @Body() updatePedidoStatusDto: UpdatePedidoStatusDto,
    ): Promise<{ message: string; status: StatusPedido }> {
        return this.pedidosService.updateStatus(id, updatePedidoStatusDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
        await this.pedidosService.remove(id);
    }
}