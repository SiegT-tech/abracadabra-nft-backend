import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { PaginationDto } from '../../../common/dto/pagination.dto';

import { AccountNftLoanFilterDto } from './nft-filters.dto';

export class GetAccountNftsLoanDto {
    @ApiProperty({ required: true, type: () => AccountNftLoanFilterDto })
    @ValidateNested()
    @Type(() => AccountNftLoanFilterDto)
    public filters: AccountNftLoanFilterDto;

    @ApiProperty({ required: false, type: () => PaginationDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => PaginationDto)
    public pagination?: PaginationDto;
}
