import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';

import { CauldronFiltersDto } from './nft-filters.dto';

export class GetNftDto {
    @ApiProperty({ required: false, type: () => CauldronFiltersDto })
    @ValidateNested()
    @Type(() => CauldronFiltersDto)
    public filters: CauldronFiltersDto;

    @ApiProperty({ required: false, type: () => PaginationDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => PaginationDto)
    public pagination?: PaginationDto;
}
