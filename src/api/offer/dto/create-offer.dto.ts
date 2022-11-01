import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsIn, IsNumber, IsOptional, IsString, IsUUID, Length, ValidateIf } from 'class-validator';

import { OfferType } from '../../../common/db/offer-entity/types';
import { IsValidAddress } from '../../../utils';

export class CreateOfferDto {
    @ApiProperty({ enum: [OfferType.LEND, OfferType.BORROW], description: '1 - Lend, 2 - Borrow' })
    @IsDefined()
    @IsNumber()
    @IsIn([OfferType.LEND, OfferType.BORROW])
    public type: OfferType;

    @ApiProperty({ type: String, format: 'uuid' })
    @IsDefined()
    @IsString()
    @IsUUID()
    public cauldronId: string;

    @ApiProperty({ type: String, description: "Initiator's address" })
    @IsDefined()
    @IsString()
    @Length(42, 42)
    @IsValidAddress()
    public address: string;

    @ApiProperty()
    @IsDefined()
    @IsString()
    public signature: string;

    @ApiProperty({ type: Number, description: 'How much will you get' })
    @IsDefined()
    @IsNumber()
    public valuation: number;

    @ApiProperty({ type: Number, description: 'Length of loan in seconds' })
    @IsDefined()
    @IsNumber()
    public duration: number;

    @ApiProperty({ type: Number, description: 'Variable cost of taking out the loan' })
    @IsDefined()
    @IsNumber()
    public annualInterestBPS: number;

    @ApiProperty()
    @IsDefined()
    @IsNumber()
    public deadline: number;

    @ApiProperty()
    @IsDefined()
    @IsNumber()
    public tokenId: number;

    @ApiProperty({ required: false })
    @ValidateIf(dto => dto.type === OfferType.LEND)
    @IsDefined()
    @IsBoolean()
    public anyTokenId?: boolean;

    @ApiProperty({ type: String, required: false, description: 'Oracle used for price' })
    @IsOptional()
    @IsString()
    @Length(42, 42)
    @IsValidAddress()
    public oracle?: string;

    @ApiProperty({ required: false, type: Number, description: 'Required to avoid liquidation' })
    @IsOptional()
    @IsNumber()
    public ltvBPS?: number;
}
