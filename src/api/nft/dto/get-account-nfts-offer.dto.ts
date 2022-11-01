import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { PaginationDto } from '../../../common/dto/pagination.dto';

import { AccountNftOfferFilterDto } from './nft-filters.dto';

export class GetAccountNftsOfferDto {
    @ApiProperty({ required: true, type: () => AccountNftOfferFilterDto })
    @ValidateNested()
    @Type(() => AccountNftOfferFilterDto)
    public filters: AccountNftOfferFilterDto;

    @ApiProperty({ required: false, type: () => PaginationDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => PaginationDto)
    public pagination?: PaginationDto;
}
