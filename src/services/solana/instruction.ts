import BN from "bn.js"
import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { Keypair, Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction, TransactionInstruction, Signer, Commitment } from "@solana/web3.js"

export namespace IBPortInstruction {
  export type CreateTransferUnwrapRequest = {
    amount: BN
    receiver: Uint8Array
  }

  export class Broadcaster {
    connection: Connection

    constructor(endpoint: string, commitment: Commitment) {
      this.connection = new Connection(endpoint, commitment)
      // this.connection = new Connection("http://localhost:8899", 'singleGossip');
    }

    async broadcast(txInstruction: TransactionInstruction, signers: Signer[]) {
      const tx = new Transaction().add(txInstruction)
      await this.connection.sendTransaction(tx, signers, { skipPreflight: false, preflightCommitment: "singleGossip" })

      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  export class InstructionBuilder {
    initializer: Keypair

    ibportProgram: PublicKey
    spenderTokenAccount: PublicKey
    tokenProgramAccount: PublicKey

    tokenOwner: PublicKey

    constructor(props: { initializer: Keypair; ibportProgram: PublicKey; tokenProgramAccount: PublicKey; spenderTokenAccount: PublicKey; tokenOwner: PublicKey }) {
      this.initializer = props.initializer

      this.ibportProgram = props.ibportProgram
      this.spenderTokenAccount = props.spenderTokenAccount
      this.tokenProgramAccount = props.tokenProgramAccount

      this.tokenOwner = props.tokenOwner
    }

    async getIBPortPDA(): Promise<PublicKey> {
      return await PublicKey.createProgramAddress([Buffer.from("ibport")], this.ibportProgram)
    }

    buildCreateTokenAccountInstruction(tokenHolder: PublicKey): TransactionInstruction {
      return Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,
        this.tokenProgramAccount,
        tokenHolder,
        // new PublicKey(0)
        this.tokenOwner
        // initializerAccount.publicKey
      )
    }

    async buildCreateTransferUnwrapRequest(raw: CreateTransferUnwrapRequest): Promise<TransactionInstruction> {
      // Instruction Index = u8
      let rawData = Uint8Array.of(...new BN(1).toArray("le", 1))
      // Token Amount = f64
      rawData = Uint8Array.of(...rawData, ...new BN(raw.amount).toArray("le", 8))
      // Receiver
      rawData = Uint8Array.of(...rawData, ...raw.receiver)

      const data = Buffer.from(rawData)

      console.log(raw.amount)
      console.log(raw.receiver)

      const tx = new TransactionInstruction({
        programId: this.ibportProgram,
        keys: [
          {
            pubkey: this.initializer.publicKey,
            isSigner: true,
            isWritable: false,
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
            pubkey: this.spenderTokenAccount,
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
