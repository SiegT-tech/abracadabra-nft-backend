import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { PaginationDto } from '../../../common/dto/pagination.dto';

import { AccountNftFilterDto } from './nft-filters.dto';

export class GetAccountNftsDto {
    @ApiProperty({ required: true, type: () => AccountNftFilterDto })
    @ValidateNested()
    @Type(() => AccountNftFilterDto)
    public filters: AccountNftFilterDto;

    @ApiProperty({ required: false, type: () => PaginationDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => PaginationDto)
    public pagination?: PaginationDto;
}
