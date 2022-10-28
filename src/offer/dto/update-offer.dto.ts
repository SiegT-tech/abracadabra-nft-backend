import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

import { CreateOfferDto } from './create-offer.dto';

export class UpdateOfferDto extends CreateOfferDto {
    @ApiProperty({
        required: true,
        type: String,
        format: 'uuid',
        description: 'Offer id',
    })
    @IsString()
    @IsUUID()
    public offerId: string;
}
