import { getAddress } from 'nestjs-ethers';

export function validateAndParseAddress(address: string): string {
    try {
        const checksummedAddress = getAddress(address);
        return checksummedAddress;
    } catch (error) {
        throw Error(`${address} is not a valid address.`);
    }
}
