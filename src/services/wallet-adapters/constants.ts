import { LedgerWalletAdapter, SolongWalletAdapter, PhantomWalletAdapter, MathWalletAdapter } from "../wallet-adapters"

const ASSET_URL = "https://cdn.jsdelivr.net/gh/solana-labs/oyster@main/assets/wallets"

export const WALLET_PROVIDERS = [
  {
    name: "sollet.io",
    url: "https://www.sollet.io",
    icon: `${ASSET_URL}/sollet.svg`,
  },
  {
    name: "Solflare",
    url: "https://solflare.com/access-wallet",
    icon: `${ASSET_URL}/solflare.svg`,
  },
  {
    name: "Ledger",
    url: "https://www.ledger.com",
    icon: `${ASSET_URL}/ledger.svg`,
    adapter: LedgerWalletAdapter,
  },
  {
    name: "Solong",
    url: "https://www.solong.com",
    icon: `${ASSET_URL}/solong.png`,
    adapter: SolongWalletAdapter,
  },
  {
    name: "MathWallet",
    url: "https://www.mathwallet.org",
    icon: `${ASSET_URL}/mathwallet.svg`,
    adapter: MathWalletAdapter,
  },
  {
    name: "Phantom",
    url: "https://www.phantom.app",
    icon: `https://www.phantom.app/img/logo.png`,
    adapter: PhantomWalletAdapter,
  },
]
