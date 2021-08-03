import axios from "axios"
import BN from "bn.js"
import bs58 from "bs58"
import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { Connection, PublicKey, Transaction, TransactionInstruction, Signer, Commitment, TransactionSignature, Account, AccountInfo } from "@solana/web3.js"

import { sendTransaction } from "./utils/connection"
import { WalletAdapter } from "~/services/wallet-adapters/types"
import { approveAmount, createSplAccount } from "~/services/solana/utils/pools"

export function randomUint8() {
  return Math.floor(255 * Math.random())
}

export function float64ToUint8Array(floatValue: number): Uint8Array {
  const fl = new Float64Array(1)

  fl[0] = floatValue

  const arr = new Uint8Array(fl.buffer)
  return arr
}

export interface AllocatorResponse {
  // eslint-disable-next-line camelcase
  public_key: string
  // eslint-disable-next-line camelcase
  token_mint: string
  // eslint-disable-next-line camelcase
  tx_signature: string
}

export namespace IBPort {
  export class LocalStorageSaver {
    private static formKey(tokenBinary: string, holder: string) {
      return tokenBinary + "_" + holder
    }

    static saveTokenAccount(tokenBinary: string, holder: string, acc: Account) {
      const key = LocalStorageSaver.formKey(tokenBinary, holder)

      const encodedPK = bs58.encode(acc.secretKey)

      window.localStorage.setItem(key, encodedPK)
    }

    static getTokenAccount(tokenBinary: string, holder: string): Account | null {
      const key = LocalStorageSaver.formKey(tokenBinary, holder)

      const encodedPK = window.localStorage.getItem(key)

      if (!encodedPK) {
        return null
      }

      return new Account(bs58.decode(encodedPK))
    }
  }

  export type CreateTransferUnwrapRequest = {
    // amount: BN
    amount: Uint8Array
    receiver: Uint8Array
  }

  export class Broadcaster {
    connection: Connection
    adapter: WalletAdapter

    constructor(adapter: WalletAdapter, endpoint: string, commitment: Commitment) {
      this.adapter = adapter
      this.connection = new Connection(endpoint, commitment)
      // this.connection = new Connection("http://localhost:8899", 'singleGossip');
    }

    async broadcastTransaction(tx: Transaction, signers: Signer[]): Promise<TransactionSignature> {
      const response = await this.connection.sendTransaction(tx, signers, { skipPreflight: false, preflightCommitment: "singleGossip" })

      await new Promise((resolve) => setTimeout(resolve, 1000))

      return response
    }

    async broadcast(txInstruction: TransactionInstruction, signers: Signer[]) {
      const tx = new Transaction().add(txInstruction)
      await this.connection.sendTransaction(tx, signers, { skipPreflight: false, preflightCommitment: "singleGossip" })

      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    async signAndBroadcast(transaction: Transaction) {
      const { connection, adapter: wallet } = this
      const { blockhash } = await connection.getRecentBlockhash()

      transaction.recentBlockhash = blockhash
      transaction.feePayer = wallet.publicKey

      const signed = await wallet.signTransaction(transaction)

      const txid = await connection.sendRawTransaction(signed.serialize())
      const resp = await connection.confirmTransaction(txid)

      console.log({ signed, txid, resp })
    }
  }

  export class Invoker {
    instructionBuilder: InstructionBuilder
    broadcaster: Broadcaster

    adapter: WalletAdapter

    constructor(adapter: WalletAdapter, builderProps: InstructionBuilderProps, connectionEndpoint: string) {
      this.adapter = adapter
      this.instructionBuilder = new InstructionBuilder(builderProps)
      this.broadcaster = new Broadcaster(this.adapter, connectionEndpoint, "confirmed")
    }

    get connection(): Connection {
      return this.broadcaster.connection
    }

    get initializer(): PublicKey {
      return this.instructionBuilder.initializer
    }

    async approveSPLToken(amount: number, tokenHolderDataAccount: PublicKey, portBinary: PublicKey) {
      const instructions: TransactionInstruction[] = []
      const cleanupInstructions: TransactionInstruction[] = []
      const signers: Account[] = []

      const connection = this.connection
      const wallet = this.adapter

      // console.log({ w: wallet.publicKey, w58: wallet.publicKey.toBase58() })

      // console.log(instructions, cleanupInstructions, tokenHolderDataAccount, wallet.publicKey.toBase58(), amount, portBinary)
      // console.log(instructions, cleanupInstructions, tokenHolderDataAccount, this.initializer.toBase58(), amount, portBinary)

      approveAmount(instructions, cleanupInstructions, tokenHolderDataAccount, this.initializer, amount, portBinary)

      const tx = await sendTransaction(connection, wallet, instructions.concat(cleanupInstructions), signers)
      // console.log({ tx })

      return tx
    }

    private async fetchAccountsOwnedByAddress(
      owner: PublicKey,
      mint: PublicKey
    ): Promise<
      {
        pubkey: PublicKey
        account: AccountInfo<Buffer>
      }[]
    > {
      // const response = AccountsOwnedByAddressResponse
      const response = await this.connection.getTokenAccountsByOwner(owner, { mint })
      return response.value
    }

    private async fetchFirstTokenAccountOwnedByAddress(
      tokenBinary: PublicKey
    ): Promise<{
      pubkey: PublicKey
      account: AccountInfo<Buffer>
    } | null> {
      const tokenAcc = LocalStorageSaver.getTokenAccount(tokenBinary.toBase58(), this.initializer.toBase58())
      if (tokenAcc) {
        return {
          pubkey: tokenAcc.publicKey,
          account: null,
        }
      }

      const tokenAccountsList = await this.fetchAccountsOwnedByAddress(this.initializer, tokenBinary)
      if (tokenAccountsList.length === 0) {
        return null
      }

      return tokenAccountsList[0]
    }

    async getExistingTokenAccount(tokenBinary: PublicKey): Promise<PublicKey | null> {
      const tokenAccount = await this.fetchFirstTokenAccountOwnedByAddress(tokenBinary)
      return tokenAccount?.pubkey ?? null
    }

    async createOrGetExistingTokenAccount(tokenBinary: PublicKey): Promise<PublicKey> {
      const owner = this.initializer
      // const response = await axios.post<AllocatorResponse>("https://allocator.susy.one/api/associated-token-account/alloc", {
      const response = await axios.post<AllocatorResponse>(
        "https://allocator.susy.one/api/associated-token-account/alloc",
        {
          token_mint: tokenBinary.toBase58(),
          owner: owner.toBase58(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      return new PublicKey(response.data.public_key)
    }

    async createTokenAccount(tokenBinary: PublicKey): Promise<Account | null> {
      const instructions: TransactionInstruction[] = []
      const payer = this.initializer
      const accountRentExempt = await this.connection.getMinimumBalanceForRentExemption(AccountLayout.span)
      const mint = tokenBinary
      const owner = payer

      const newToAccount = createSplAccount(instructions, payer, accountRentExempt, mint, owner, AccountLayout.span)

      const signers: Account[] = []

      try {
        const tx = await sendTransaction(this.connection, this.adapter, instructions, [newToAccount, ...signers])
        console.log({ tx })

        return newToAccount
      } catch (err) {
        console.log({ err })
      }

      return null
    }

    // amount as float (non-decimal)
    async createTransferUnwrapRequest(uiAmount: number, amount: number, receiver: Uint8Array, spender: PublicKey, tokenHolderDataAccount: PublicKey, portBinary: PublicKey) {
      const instructions: TransactionInstruction[] = []
      const cleanupInstructions: TransactionInstruction[] = []
      const signers: Account[] = []

      const connection = this.connection
      const wallet = this.adapter

      approveAmount(instructions, cleanupInstructions, tokenHolderDataAccount, this.initializer, amount, portBinary)

      // const tx = await sendTransaction(connection, wallet, instructions.concat(cleanupInstructions), signers)

      const floatBytes = float64ToUint8Array(uiAmount)
      const createTransferUnwrapIX = await this.instructionBuilder.buildCreateTransferUnwrapRequest({ amount: floatBytes, receiver }, spender)

      instructions.push(createTransferUnwrapIX)
      // console.log({ ix })
      // const tx = await sendTransaction(this.connection, this.adapter, [ix], [])
      // console.log({ tx })
      const tx = await sendTransaction(connection, wallet, instructions.concat(cleanupInstructions), signers)

      return tx
    }
  }

  export type InstructionBuilderProps = { initializer: PublicKey; ibportProgram: PublicKey; ibportDataAccount: PublicKey; tokenProgramAccount: PublicKey; tokenOwner: PublicKey }
  export class InstructionBuilder {
    // initializer: Keypair
    initializer: PublicKey

    ibportProgram: PublicKey
    ibportDataAccount: PublicKey
    tokenProgramAccount: PublicKey

    tokenOwner: PublicKey

    constructor(props: InstructionBuilderProps) {
      this.initializer = props.initializer

      this.ibportProgram = props.ibportProgram
      this.ibportDataAccount = props.ibportDataAccount
      this.tokenProgramAccount = props.tokenProgramAccount

      this.tokenOwner = props.tokenOwner
    }

    updateTokenOwner(tokenOwner: PublicKey) {
      this.tokenOwner = tokenOwner
    }

    async getIBPortPDA(): Promise<PublicKey> {
      return await PublicKey.createProgramAddress([Buffer.from("ibport")], this.ibportProgram)
    }

    async buildCreateTransferUnwrapRequest(raw: CreateTransferUnwrapRequest, spender: PublicKey): Promise<TransactionInstruction> {
      // Instruction Index = u8
      let rawData = Uint8Array.of(...new BN(1).toArray("le", 1))
      // Token Amount = f64
      // rawData = Uint8Array.of(...rawData, ...new BN(raw.amount).toArray("le", 8))
      rawData = Uint8Array.of(...rawData, ...raw.amount)
      // Receiver - 32 bytes
      const receiverBytes = new Uint8Array(32)
      receiverBytes.set(raw.receiver, 0)

      rawData = Uint8Array.of(...rawData, ...receiverBytes)
      // Swap ID - 16 bytes
      rawData = Uint8Array.of(...rawData, ...new Uint8Array(16).map(() => randomUint8()))

      const data = Buffer.from(rawData)

      console.log({ data, bufferLen: data.length, goal: 1 + 8 + 32 + 16 })
      console.log(raw.amount)
      console.log(raw.receiver)

      const tx = new TransactionInstruction({
        programId: this.ibportProgram,
        keys: [
          {
            pubkey: this.initializer,
            isSigner: true,
            isWritable: false,
          },
          {
            pubkey: this.ibportDataAccount,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: TOKEN_PROGRAM_ID,
            isSigner: false,
            isWritable: false,
          },
          {
            // Token deployed and bind to TOKEN_PROGRAM_ID
            // actually it's result of `spl-token create-token`
            pubkey: this.tokenProgramAccount,
            isSigner: false,
            isWritable: true,
          },
          {
            // the man we allowed to burn tokens from (caller)
            pubkey: spender,
            isSigner: false,
            isWritable: true,
          },
          {
            // IB Port PDA
            pubkey: await this.getIBPortPDA(),
            isSigner: false,
            isWritable: false,
          },
        ],
        data,
      })
      return tx
    }
  }
}
