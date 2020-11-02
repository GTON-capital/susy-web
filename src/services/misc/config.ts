

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
            luport: '3Mns3qH1SuWfw2r9LMLdBKyaGQhQGnAbz42',
            ibport: process.env.WAVES_IB_PORT
        },
        ethereumChain: {
            // luport: process.env.ETH_LU_PORT,
            ibport: '0x6911910B4D312F89f8C54911aB54ed79B28Ac0A7'
        },
    }
}
