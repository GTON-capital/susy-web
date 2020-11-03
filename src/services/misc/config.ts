

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
            luport: '3PEDESe94yGyY8X3Gez4u7cyZCa4JTAT6h3',
            ibport: process.env.WAVES_IB_PORT
        },
        ethereumChain: {
            // luport: process.env.ETH_LU_PORT,
            ibport: '0x9922Ec4054571711ab2bBAcda9B9E40321260ACa'
        },
    }
}
