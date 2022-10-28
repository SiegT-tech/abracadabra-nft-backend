import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { FiltersDto } from '../../common/dto/filters.dto';

export class GetCollateralsFilterDto extends FiltersDto {
    @ApiProperty({
        required: true,
        type: String,
        description: 'Search by name,address',
    })
    @IsOptional()
    @IsString()
    public search?: string;
}
