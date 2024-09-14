import { Controller, Get } from "@nestjs/common";
import { UomsService } from "./uoms.service";

@Controller('uoms')
export class UomsController {
    constructor(private readonly uomsService: UomsService) {

    }

    @Get()
    findAll() {
        return this.uomsService.findAll()
    }
}