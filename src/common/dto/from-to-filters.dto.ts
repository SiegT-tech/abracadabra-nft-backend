import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class FromToNumberFilterDto {
    @ApiProperty({
        required: false,
        type: Number,
        description: 'From option',
    })
    @IsOptional()
    @IsNumber()
    public from?: number;

    @ApiProperty({
        required: false,
        type: Number,
        description: 'To option',
    })
    @IsOptional()
    @IsNumber()
    public to?: number;
}
