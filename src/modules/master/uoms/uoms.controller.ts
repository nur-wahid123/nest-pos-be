import { ClassSerializerInterceptor, Controller, Get, UseInterceptors } from "@nestjs/common";
import { UomsService } from "./uoms.service";
import { ResponseInterceptor } from "src/common/interceptors/response.interceptor";

@Controller('uoms')
@UseInterceptors(new ResponseInterceptor(), ClassSerializerInterceptor)
export class UomsController {
    constructor(private readonly uomsService: UomsService) {

    }

    @Get()
    findAll() {
        return this.uomsService.findAll()
    }
}