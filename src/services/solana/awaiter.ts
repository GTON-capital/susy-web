// import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { Subject } from "rxjs"

// export interface AccountOwnedByAddress {
//   account: {
//     data: {
//       parsed: {
//         info: {
//           isNative: boolean
//           mint: string
//           owner: string
//           state: string
//           tokenAmount: {
//             amount: string
//             decimals: number
//             uiAmount: number
//             uiAmountString: string
//           }
//         }
//         type: string
//       }
//       program: string
//       space: number
//     }
//     executable: boolean
//     lamports: number
//     owner: string
//     rentEpoch: number
//   }
//   pubkey: string
// }

// export type GenericResponse<T> = {
//   jsonrpc: string
//   result: T
//   id: number
// }

// export type AccountsOwnedByAddressResponse = GenericResponse<{
//   context: Context
//   value: AccountOwnedByAddress[]
// }>

export interface LogsNotificationRPCResponse {
  jsonrpc: string
  method: string
  params: Params
}

export interface Params {
  result: Result
  subscription: number
}

export interface Result {
  context: Context
  value: Value
}

export interface Context {
  slot: number
}

export interface Value {
  signature: string
  err: any
  logs: string[]
}

export type DepositAwaiterProps = {
  tokenMint: string
  receiverTokenDataAccount: string
  programDataAccount: string
  targetAmount: number
  // tokenOwner: string
}

export class SolanaDepositAwaiter {
  connection: WebSocket
  subject: Subject<string>
  props: DepositAwaiterProps

  constructor(props: DepositAwaiterProps, subject: Subject<string>) {
    this.props = Object.assign({}, props)

    this.connection = new WebSocket("wss://api.mainnet-beta.solana.com/")
    this.subject = subject
  }

  start() {
    const subscribe = this.subscribe.bind(this)
    const process = this.processAccountNotification.bind(this)

    this.connection.onopen = function (greeting) {
      console.log({ greeting })
      subscribe()
    }

    this.connection.onmessage = function (event) {
      console.log("got event!", { event })
      const eventData = JSON.parse(event.data) as LogsNotificationRPCResponse

      console.log({ event, eventData })
      if (eventData.method !== "logsNotification") {
        return
      }

      return process(eventData.params.result, event.data)
    }
  }

  private processAccountNotification(notification: Result, rawBody: string) {
    const signature = notification?.value?.signature

    if (!signature) {
      return
    }

    // dumb check for amount

    // dumb check for operation
    if (!rawBody.includes("MintTo") || !rawBody.includes(String(this.props.targetAmount))) {
      return
    }

    this.subject.next(signature)
    // const info = notification.value.data.parsed.info
    // const programOwner = notification.value.owner

    // if (info.mint !== this.props.tokenMint) {
    //   console.error("the mint is not valid")
    //   return
    // }

    // if (programOwner !== TOKEN_PROGRAM_ID.toBase58()) {
    //   console.error("the program owner is not valid")
    //   return
    // }
  }

  private subscribe() {
    // console.log({ programDataAccount })
    this.connection.send(
      JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "logsSubscribe",
        params: [
          {
            mentions: [this.props.receiverTokenDataAccount],
          },
          {
            commitment: "finalized",
          },
        ],
      })
    )
    // this.connection.send(
    //   JSON.stringify({
    //     jsonrpc: "2.0",
    //     id: 1,
    //     method: "programSubscribe",
    //     params: [
    //       programDataAccount,
    //       {
    //         encoding: "jsonParsed",
    //         commitment: "finalized",
    //       },
    //     ],
    //   })
    // )
  }
}
