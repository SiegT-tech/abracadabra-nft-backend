import { Injectable } from '@nestjs/common';
import { HashZero, splitSignature } from 'nestjs-ethers';

import { CauldronEntityService } from '../../common/db/cauldron-entity/services/cauldron-entity.service';
import { NftHelpersEntityService } from '../../common/db/nft-entity/services/nft-entity-helpers.service';
import { OfferEntityService } from '../../common/db/offer-entity/services/offer-entity.service';
import { OfferType } from '../../common/db/offer-entity/types';
import { BlockchainService } from '../../common/modules/blockchain/services/blockchain.service';
import { ALREADY_EXIST_ERRORS, INVALID_ARGUMENT_ERRORS } from '../../common/modules/exceptions/codes';
import { AlreadyExistsException, InternalException } from '../../common/modules/exceptions/exceptions';

import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferUtilsService } from './services/offer-utils.service';

@Injectable()
export class OfferHandler {
    constructor(
        private readonly cauldronEntityService: CauldronEntityService,
        private readonly offerUtilsService: OfferUtilsService,
        private readonly blockchainService: BlockchainService,
        private readonly offerEntityService: OfferEntityService,
        private readonly nftHelpersEntityService: NftHelpersEntityService,
    ) {}

    public async createOffer(dto: CreateOfferDto): Promise<{}> {
        const { cauldronId, type, address, signature, valuation, duration, annualInterestBPS, deadline, tokenId, anyTokenId, oracle, ltvBPS } = dto;

        const cauldron = await this.cauldronEntityService.readOneOrFaild({ id: cauldronId });
        const exist = await this.offerEntityService.checkIfExist(cauldron.collateral.id, tokenId, type, address);

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

        const nft = await this.nftHelpersEntityService.findOrCreateNft(cauldron.collateral, tokenId);

        await this.offerEntityService.create({
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
            oracle,
            ltvBPS,
        });
        return {};
    }

    public async removeOffer(id: string) {
        await this.offerEntityService.delete({ id });
        return {};
    }

    public async updateOffer({ offerId, ...offer }: UpdateOfferDto) {
        await this.removeOffer(offerId);
        try{
            await this.createOffer(offer);
        } catch(err){
            await this.offerEntityService.restore({ id: offerId });
            throw err;
        }
        return {};
    }
}
