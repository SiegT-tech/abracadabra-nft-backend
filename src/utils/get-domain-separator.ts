import { defaultAbiCoder, keccak256 } from 'nestjs-ethers';

import { hashUtf8String } from './hash-utf8-string';

import { Networks } from '../blockchain/constants';

const DOMAIN_SEPARATOR_HASH = hashUtf8String('EIP712Domain(uint256 chainId,address verifyingContract)');

export const getDomainSeparator = (network: Networks, masterContractAddress: string): string =>
    keccak256(defaultAbiCoder.encode(['bytes32', 'uint256', 'address'], [DOMAIN_SEPARATOR_HASH, network, masterContractAddress]));
