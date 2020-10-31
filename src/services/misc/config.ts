

interface ChainConfig {
    luport?: string;
    ibport?: string;
}

interface EnvironmentConfig {
    wavesChain?: ChainConfig;
    ethereumChain?: ChainConfig;
}


export function processConfig(): EnvironmentConfig {
    return {
        wavesChain: {
            // luport: process.env.WAVES_LU_PORT,
            luport: '3MgiUVtwHGDxFSRPAoKNaNLgwmCiCnrxNVN',
            ibport: process.env.WAVES_IB_PORT
        },
        ethereumChain: {
            // luport: process.env.ETH_LU_PORT,
            ibport: '0x276111F661989049f1D859105a07F5B2E2e604C8'
        },
    }
}
