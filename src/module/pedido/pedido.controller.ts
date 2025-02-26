import {Controller, Post, Body, HttpCode, HttpStatus, Get} from '@nestjs/common';
import {PedidosService} from "./pedido.service";
import {CreatePedidoDto} from "./create-pedido.dto";
import {PedidoDto} from "./pedido.dto";


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
}