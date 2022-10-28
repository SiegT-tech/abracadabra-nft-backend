import { keccak256Pack } from 'nestjs-ethers';

const EIP191_PREFIX_FOR_EIP712_STRUCTURED_DATA = '\x19\x01';

export const getDigest = (domainSeporator: string, dataHash: string): string =>
    keccak256Pack(['string', 'bytes32', 'bytes32'], [EIP191_PREFIX_FOR_EIP712_STRUCTURED_DATA, domainSeporator, dataHash]);
