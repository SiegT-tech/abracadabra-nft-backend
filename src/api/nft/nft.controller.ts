import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GetAccountNftsLoanDto } from './dto/get-account-nfts-loan.dto';
import { GetAccountNftsOfferDto } from './dto/get-account-nfts-offer.dto';
import { GetAccountNftsDto } from './dto/get-account-nfts.dto';
import { GetNftDto } from './dto/get-nfts.dto';
import { NftFiltersDto } from './dto/nft-filters.dto';
import { NftHandler } from './nft.handler';

@ApiTags('Nft')
@Controller('nfts')
export class NftController {
    constructor(private readonly nftHandler: NftHandler) {}

    @Post()
    public getNfts(@Body() body: GetNftDto) {
        return this.nftHandler.getNfts(body);
    }

    @Post('nft/:id')
    public getNft(@Body() body: NftFiltersDto, @Param('id') nftId: string) {
        return this.nftHandler.getNft(body, nftId);
    }

    @Get('nft/last')
    public getLatsNfts() {
        return this.nftHandler.getLatsNfts();
    }

    @Post('/account')
    public getAccountNfts(@Body() body: GetAccountNftsDto) {
        return this.nftHandler.getAccountNfts(body);
    }

    @Post('/account/loan')
    public getAccountNftsLoan(@Body() body: GetAccountNftsLoanDto) {
        return this.nftHandler.getAccountNftsLoan(body);
    }

    @Post('/account/offer')
    public getAccountNftsOffer(@Body() body: GetAccountNftsOfferDto) {
        return this.nftHandler.getAccountNftsOffer(body);
    }
}
