import { BigNumberish, EthersModuleOptions } from 'nestjs-ethers';

import { ETH_RPC, ETH_ROPSTEN_RPC, POLYGON_RPC } from '../env';

export enum Networks {
    UNKNOW = 0,
    MAINNET = 1,
    ROPSTEN = 3,
    POLYGON = 137,
}

export const NetworksNames = {
    [Networks.MAINNET]: "ETHEREUM",
    [Networks.POLYGON]: "POLYGON"
}

export const ethersModules: EthersModuleOptions[] = [
    { token: 'eth', network: Networks.MAINNET, useDefaultProvider: false, custom: ETH_RPC },
    { token: 'eth-ropsten', network: Networks.ROPSTEN, useDefaultProvider: false, custom: ETH_ROPSTEN_RPC },
    { token: 'matic', network: Networks.POLYGON, useDefaultProvider: false, custom: POLYGON_RPC },
];

export const availableNetworks = [Networks.POLYGON];

export enum CauldronEvents {
    LogRequestLoan = 'LogRequestLoan',
    LogUpdateLoanParams = 'LogUpdateLoanParams',
    LogRemoveCollateral = 'LogRemoveCollateral',
    LogLend = 'LogLend',
    LogRepay = 'LogRepay',
    LogFeeTo = 'LogFeeTo',
    LogWithdrawFees = 'LogWithdrawFees',
}

export interface TokenLoanParams {
    readonly valuation: BigNumberish; // How much will you get? OK to owe until expiration.
    readonly duration: BigNumberish; // Length of loan in seconds
    readonly annualInterestBPS: BigNumberish; // Variable cost of taking out the loan
}

export interface TokenLoanParamsWithOracle extends TokenLoanParams {
    readonly ltvBPS: BigNumberish; // Required to avoid liquidation
    readonly oracle: string; // Oracle used for price
}

export enum CollateralEvents {
    Transfer = 'Transfer',
}

export enum BentoboxEvents {
    LogDeploy = 'LogDeploy',
}

export const masterContracts: { [key in Networks]?: string[] } = {
    [Networks.MAINNET]: [],
    [Networks.ROPSTEN]: ['0x3a341f5474aac54829a587cE6ab13C86af6B1E29'],
    [Networks.POLYGON]: [
        '0xf1e655063Ca5f86b022eB61a49aB1BB87f68228a', // mock
        '0xC5D39C97623fD076c260D981143310dae9BB93A8', // mock
        '0x4eeBeF03193099825F329A0F7615E69A10a5462A', // NFTPair
        '0x32134A95E94489CeED70Df48F0cB89C0115F9C01', // NFTPairWithOracle
    ],
};

export const exporerUris: { [key in Networks]?: string } = {
    [Networks.MAINNET]: 'https://api.etherscan.io/api',
    [Networks.ROPSTEN]: 'https://api-ropsten.etherscan.io/api',
    [Networks.POLYGON]: 'https://api.polygonscan.com/api',
};
