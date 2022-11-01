import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsNumber, IsOptional, IsString, IsUUID, Length } from 'class-validator';

import { OfferType } from '../../../common/db/offer-entity/types';
import { FiltersDto } from '../../../common/dto/filters.dto';
import { OfferFilters } from '../../../common/dto/offer-filters.dto';
import { IsValidAddress } from '../../../utils';

export class CauldronFiltersDto extends OfferFilters {
    @ApiProperty({
        required: false,
        type: Array,
        description: 'Cauldron ids',
    })
    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    public cauldronIds?: string[];
}

export class NftFiltersDto {
    @ApiProperty({
        required: true,
        type: String,
        format: 'uuid',
        description: 'Collateral id',
    })
    @IsString()
    @IsUUID()
    public collateralId: string;
}

export class AccountNftFilterDto extends FiltersDto {
    @ApiProperty({ required: true, type: String, description: 'Account address' })
    @IsString()
    @Length(42, 42)
    @IsValidAddress()
    public account: string;
}

export class AccountNftLoanFilterDto extends CauldronFiltersDto {
    @ApiProperty({ required: false, type: String, description: 'Borrower address' })
    @IsOptional()
    @IsString()
    @Length(42, 42)
    @IsValidAddress()
    public borrower?: string;

    @ApiProperty({ required: false, type: String, description: 'Lender address' })
    @IsOptional()
    @IsString()
    @Length(42, 42)
    @IsValidAddress()
    public lender?: string;
}

export class AccountNftOfferFilterDto extends OfferFilters {
    @ApiProperty({
        required: false,
        enum: OfferType,
        description: 'Offer type',
    })
    @IsOptional()
    @IsNumber()
    @IsIn([OfferType.LEND, OfferType.BORROW])
    public type?: OfferType;

    @ApiProperty({ required: true, type: String, description: 'Account address' })
    @IsString()
    @Length(42, 42)
    @IsValidAddress()
    public account: string;
}
