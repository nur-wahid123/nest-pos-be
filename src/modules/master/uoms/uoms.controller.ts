import { Body, ClassSerializerInterceptor, Controller, Get, Post, Put, UseInterceptors } from "@nestjs/common";
import { UomsService } from "./uoms.service";
import { ResponseInterceptor } from "src/common/interceptors/response.interceptor";
import { CreateUomDto } from "./dto/create-uom.dto";
import { UpdateUomDto } from "./dto/update-uom.dto";

@Controller('uoms')
@UseInterceptors(new ResponseInterceptor(), ClassSerializerInterceptor)
export class UomsController {
    constructor(private readonly uomsService: UomsService) {

    }

    @Get()
    findAll() {
        return this.uomsService.findAll()
    }

    @Post()
    createUom(@Body() createUomDto: CreateUomDto) {
        // return "ha"
        return this.uomsService.create(createUomDto)
    }

    @Put()
    updateUom(@Body() updateUomDto: UpdateUomDto) {
        // return "ha"
        return this.uomsService.update(updateUomDto)
    }
}