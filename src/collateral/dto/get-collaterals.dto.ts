import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';

import { GetCollateralsFilterDto } from './get-collaterals-filter.dto';

export class GetCauldronsDto {
    @ApiProperty({ required: false, type: () => GetCollateralsFilterDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => GetCollateralsFilterDto)
    public filters?: GetCollateralsFilterDto;

    @ApiProperty({ required: false, type: () => PaginationDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => PaginationDto)
    public pagination?: PaginationDto;
}
