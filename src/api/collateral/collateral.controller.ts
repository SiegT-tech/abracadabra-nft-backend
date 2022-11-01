import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CollateralHandler } from './collateral.handler';
import { GetCauldronsDto } from './dto/get-collaterals.dto';

@ApiTags('Collateral')
@Controller('collateral')
export class CollateralController {
    constructor(private readonly collateralHandler: CollateralHandler) {}

    @Post()
    public getCollaterals(@Body() dto: GetCauldronsDto) {
        return this.collateralHandler.getCollaterals(dto);
    }

    @Get('list')
    public getCollateralList() {
        return this.collateralHandler.getCollateralList();
    }

    @Get('get-collateral/:id')
    public getCollateral(@Param('id') id: string) {
        return this.collateralHandler.getCollateral(id);
    }
}
