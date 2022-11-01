import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferHandler } from './offer.handler';

@ApiTags('Offer')
@Controller('offer')
export class OfferController {
    constructor(private readonly offerHandler: OfferHandler) {}

    @Post('create')
    public createOffer(@Body() dto: CreateOfferDto) {
        return this.offerHandler.createOffer(dto);
    }

    @Delete(':id')
    public removeOffer(@Param('id') offerId: string) {
        return this.offerHandler.removeOffer(offerId);
    }

    @Post('update')
    public updateOffer(@Body() body: UpdateOfferDto) {
        return this.offerHandler.updateOffer(body);
    }
}
