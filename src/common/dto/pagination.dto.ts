import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER, DEFAULT_ORDER_BY, DEFAULT_ORDER } from '../constants';
import { IPagination } from '../interfaces/pagination.interface';

const MAX_ORDER_BY_LENGHT = 100;

export class PaginationDto implements IPagination {
    @ApiProperty({
        required: false,
        type: Number,
        default: DEFAULT_PAGE_SIZE,
        minimum: 1,
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    public pageSize?: number;

    @ApiProperty({
        required: false,
        type: Number,
        default: DEFAULT_PAGE_NUMBER,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    public pageNumber?: number;

    @ApiProperty({
        required: false,
        type: String,
        default: DEFAULT_ORDER_BY,
    })
    @IsOptional()
    @IsString()
    @MaxLength(MAX_ORDER_BY_LENGHT)
    public orderBy?: string;

    @ApiProperty({
        required: false,
        type: String,
        default: DEFAULT_ORDER,
        enum: ['ASC', 'DESC'],
    })
    @IsOptional()
    @IsString()
    @IsIn(['ASC', 'DESC'])
    public order?: 'ASC' | 'DESC';
}
