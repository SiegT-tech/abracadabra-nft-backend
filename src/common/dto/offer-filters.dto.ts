import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

import { FiltersDto } from './filters.dto';
import { FromToNumberFilterDto } from './from-to-filters.dto';

export class OfferFilters extends FiltersDto {
    @ApiProperty({
        required: false,
        type: Array,
        description: 'Collateral ids',
    })
    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    public collateralIds?: string[];

    @ApiProperty({
        required: false,
        type: String,
        description: 'Asset ids',
    })
    @IsOptional()
    @IsString()
    @IsUUID('4')
    public assetId?: string;

    @ApiProperty({ required: false, type: () => FromToNumberFilterDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => FromToNumberFilterDto)
    public valuation?: FromToNumberFilterDto;

    @ApiProperty({ required: false, type: () => FromToNumberFilterDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => FromToNumberFilterDto)
    public annualInterestBPS?: FromToNumberFilterDto;

    @ApiProperty({ required: false, type: () => FromToNumberFilterDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => FromToNumberFilterDto)
    public duration?: FromToNumberFilterDto;

    @ApiProperty({ required: false, type: () => FromToNumberFilterDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => FromToNumberFilterDto)
    public ltvBPS?: FromToNumberFilterDto;
}
