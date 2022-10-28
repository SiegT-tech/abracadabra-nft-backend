import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { FiltersDto } from '../../common/dto/filters.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class GetAssetsDto {
    @ApiProperty({ required: false, type: () => FiltersDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => FiltersDto)
    public filters?: FiltersDto;

    @ApiProperty({ required: false, type: () => PaginationDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => PaginationDto)
    public pagination?: PaginationDto;
}
