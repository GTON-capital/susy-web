

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
            luport: '3MfrEbGpHKEkBiyEx7jvCYrp9zYpha9ejCD',
            ibport: process.env.WAVES_IB_PORT
        },
        ethereumChain: {
            // luport: process.env.ETH_LU_PORT,
            ibport: '0x38D1851Cf184bA3D564BA0144BAF0Ef4d9C0457F'
        },
    }
}
