import { Injectable } from '@nestjs/common';
import { HashZero, splitSignature } from 'nestjs-ethers';
import { from, mapTo, mergeMap } from 'rxjs';

import { OfferType } from './dao/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferUtilsService } from './services/offer-utils.service';
import { OfferService } from './services/offer.service';

import { BlockchainService } from '../blockchain/blockchain.service';
import { CauldronService } from '../cauldron/services/cauldron.service';
import { ALREADY_EXIST_ERRORS, INVALID_ARGUMENT_ERRORS } from '../exceptions/codes';
import { AlreadyExistsException, InternalException } from '../exceptions/exceptions';
import { NftHelpersService } from '../nft/services/nft-helpers.service';

@Injectable()
export class OfferHandler {
    constructor(
        private readonly cauldronService: CauldronService,
        private readonly offerUtilsService: OfferUtilsService,
        private readonly blockchainService: BlockchainService,
        private readonly offerService: OfferService,
        private readonly nftHelpersService: NftHelpersService,
    ) {}

    public async createOffer(dto: CreateOfferDto): Promise<{}> {
        const { cauldronId, type, address, signature, valuation, duration, annualInterestBPS, deadline, tokenId, anyTokenId, oracle, ltvBPS } = dto;

        const cauldron = await this.cauldronService.readOneOrFaild({ id: cauldronId });
        const exist = await this.offerService.checkIfExist(cauldron.collateral.id, tokenId, type);

        if (exist) {
            throw new AlreadyExistsException(ALREADY_EXIST_ERRORS.OFFER_EXIST);
        }

        const cauldronContract = this.blockchainService.getNftPair(cauldron.network, cauldron.address);
        const nonce = await cauldronContract.currentBatchIds(address);

        let checkSign = false;

        if (type === OfferType.BORROW) {
            if (cauldron.oracle) {
                checkSign = this.offerUtilsService.checkBorrowSignatureWithOralce(
                    cauldron,
                    tokenId,
                    valuation,
                    duration,
                    annualInterestBPS,
                    nonce.toNumber(),
                    deadline,
                    address,
                    signature,
                    oracle,
                    ltvBPS,
                );
            } else {
                checkSign = this.offerUtilsService.checkBorrowSignature(cauldron, tokenId, valuation, duration, annualInterestBPS, nonce.toNumber(), deadline, address, signature);
            }
        }

        if (type === OfferType.LEND) {
            const { v, r, s } = splitSignature(signature);
            if (v === 0 && r === HashZero && s === HashZero) {
                throw new Error('not impliment');
            } else if (cauldron.oracle) {
                checkSign = this.offerUtilsService.checkLendSignatureWithOralce(
                    cauldron,
                    anyTokenId,
                    tokenId,
                    valuation,
                    duration,
                    annualInterestBPS,
                    nonce.toNumber(),
                    deadline,
                    address,
                    signature,
                    oracle,
                    ltvBPS,
                );
            } else {
                checkSign = this.offerUtilsService.checkLendSignature(
                    cauldron,
                    anyTokenId,
                    tokenId,
                    valuation,
                    duration,
                    annualInterestBPS,
                    nonce.toNumber(),
                    deadline,
                    address,
                    signature,
                );
            }
        }

        if (!checkSign) {
            throw new InternalException(INVALID_ARGUMENT_ERRORS.SIGNATURE_IS_INVALID);
        }

        const nft = await this.nftHelpersService.findOrCreateNft(cauldron.collateral, tokenId);

        await this.offerService.create({
            address,
            duration,
            valuation,
            annualInterestBPS,
            deadline,
            nft,
            signature,
            type,
            cauldron,
            anyTokenId,
            network: cauldron.network,
            nonce: nonce.toNumber(),
        });
        return {};
    }

    public removeOffer(id: string) {
        return from(this.offerService.delete({ id })).pipe(mapTo({}));
    }

    public updateOffer({ offerId, ...offer }: UpdateOfferDto) {
        return from(this.createOffer(offer)).pipe(
            mergeMap(() => this.removeOffer(offerId)),
            mapTo({}),
        );
    }
}
