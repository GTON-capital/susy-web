import BN from "bn.js"
import bs58 from "bs58"
import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { Keypair, Connection, PublicKey, Transaction, TransactionInstruction, Signer, Commitment, TransactionSignature, SystemProgram, Account } from "@solana/web3.js"

import { sendTransaction } from "./utils/connection"
import { WalletAdapter } from "~/services/wallet-adapters/types"
import { approveAmount, createSplAccount } from "~/services/solana/utils/pools"

export function randomUint8() {
  return Math.floor(255 * Math.random())
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
    amount: BN
    receiver: Uint8Array
  }
  export class IntructionObject {
    static burnFunds(amount: string, receiver: string): CreateTransferUnwrapRequest {
      return {
        amount: new BN(amount),
        receiver: Buffer.from(receiver),
      }
    }
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

      // const payer = this.initializer
      // const accountRentExempt = await this.connection.getMinimumBalanceForRentExemption(AccountLayout.span)
      // const mint = tokenBinary

      const connection = this.connection
      const wallet = this.adapter
      console.log({ w: wallet.publicKey, w58: wallet.publicKey.toBase58() })

      // const owner = this.instructionBuilder

      console.log(instructions, cleanupInstructions, tokenHolderDataAccount, wallet.publicKey.toBase58(), amount, portBinary)
      console.log(instructions, cleanupInstructions, tokenHolderDataAccount, this.initializer.toBase58(), amount, portBinary)

      approveAmount(instructions, cleanupInstructions, tokenHolderDataAccount, this.initializer, amount, portBinary)

      const tx = await sendTransaction(connection, wallet, instructions.concat(cleanupInstructions), signers)
      console.log({ tx })

      return tx
    }

    getMemorizedTokenAccount(tokenBinary: PublicKey): Account | null {
      return LocalStorageSaver.getTokenAccount(tokenBinary.toBase58(), this.initializer.toBase58())
    }

    async createOrGetMemorizedTokenAccount(tokenBinary: PublicKey): Promise<Account | null> {
      const tokenAcc = LocalStorageSaver.getTokenAccount(tokenBinary.toBase58(), this.initializer.toBase58())
      console.log({ tokenAcc })

      if (!tokenAcc) {
        const tokenAcc = await this.createTokenAccount(tokenBinary)
        LocalStorageSaver.saveTokenAccount(tokenBinary.toBase58(), this.initializer.toBase58(), tokenAcc!)
        return tokenAcc
      }

      return tokenAcc
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

    async createTransferUnwrapRequest(amount: number, receiver: Uint8Array, spender: PublicKey) {
      const ix = await this.instructionBuilder.buildCreateTransferUnwrapRequest({ amount: new BN(amount), receiver }, spender)

      console.log({ ix })
      const tx = await sendTransaction(this.connection, this.adapter, [ix], [])
      console.log({ tx })

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
      rawData = Uint8Array.of(...rawData, ...new BN(raw.amount).toArray("le", 8))
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
