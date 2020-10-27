

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
            luport: process.env.WAVES_LU_PORT,
            ibport: process.env.WAVES_IB_PORT
        },
        ethereumChain: {
            // luport: process.env.ETH_LU_PORT,
            ibport: '0xA3AA43CF614718409FFedfCeCC2aF9e064729D5D'
        },
    }
}
