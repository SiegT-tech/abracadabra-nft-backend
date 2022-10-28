import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CauldronHandler } from './cauldron.handler';
import { GetCauldronsDto } from './dto/get-cauldrons.dto';

@ApiTags('Cauldron')
@Controller('cauldron')
export class CauldronController {
    constructor(private readonly cauldronHandler: CauldronHandler) {}

    @Post()
    public getCauldrons(@Body() body: GetCauldronsDto) {
        return this.cauldronHandler.getCauldrons(body);
    }
}
