export interface WavesKeeperAssetData {
    assetId: string;
    tokens: string;
}
export interface WavesKeeperCallArgument {
    type: 'integer' | 'string';
    value: string | number;
}

export interface WavesKeeperCallData {
    args: WavesKeeperCallArgument[];
    function: string;
}

export interface WavesKeeperTransactionData {
    fee?: WavesKeeperAssetData;
    dApp: string;
    call?: WavesKeeperCallData;
    payment?: WavesKeeperAssetData[];
    recipient?: string;
}

export interface WavesKeeperTransaction {
    type: number;
    data: WavesKeeperTransactionData;
}

export interface WavesKeeperAccountBalance {
    available: string;
    leasedOut: string;
    network: string;
}

export type WavesNetworkName = "mainnet" | "testnet" | "customnet" | "stagenet"
export type WavesNetworkCode = "W" | "T" | "S";

export interface WavesKeeperAccount {
    address: string;
    balance: WavesKeeperAccountBalance;
    lastActive: number;
    name: string;
    network: WavesNetworkName;
    networkCode: WavesNetworkCode;
    publicKey: string;
    selected: number;
    type: string;
}

export interface WavesKeeper {
    publicState: () => Promise<{
        account: WavesKeeperAccount;
        network: {
            code: WavesNetworkCode;
            matcher: string;
            server: string;
        }
    }>;
    signAndPublishTransaction: (tx: WavesKeeperTransaction) => Promise<any>;
    signTransaction: (tx: WavesKeeperTransaction) => Promise<void>;
}
