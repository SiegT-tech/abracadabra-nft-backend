import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

import { availableNetworks, Networks } from '../../blockchain/constants';

export class FiltersDto {
    @ApiProperty({
        required: false,
        enum: availableNetworks,
        description: 'Network id',
    })
    @IsOptional()
    @IsNumber()
    @IsIn(availableNetworks)
    public network?: Networks;
}
