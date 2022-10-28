import { keccak256, toUtf8Bytes } from 'nestjs-ethers';

export const hashUtf8String = (s: string): string => keccak256(toUtf8Bytes(s));
