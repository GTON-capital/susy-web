import { Subject } from "rxjs"
import _ from "lodash"
import axios from "axios"

import { EVMTokenTransferEvent, ExplorerApiResponse } from "./types"

type EVMTokenTransferEventResponse = ExplorerApiResponse<EVMTokenTransferEvent[]>

export const PolygonScanAPIKey = "44FHWAF4ETDKJ8KJTD268QWDDFDKJPXGJU"

export type EVMDepositAwaitProps = {
  nodeURL: string
  apiKey?: string
  recipient: string
  tokenAddress: string
  amount: string
  timeout: number
}

export class EVMDepositAwaiter {
  private props: EVMDepositAwaitProps
  private cachedTxs: EVMTokenTransferEvent[]
  private interval: NodeJS.Timeout

  private targetObservable: Subject<EVMTokenTransferEvent>
  private lastBlock: number

  constructor(props: EVMDepositAwaitProps, targetObservable: Subject<EVMTokenTransferEvent>) {
    this.props = Object.assign({}, props, { apiKey: PolygonScanAPIKey })
    this.cachedTxs = []
    this.lastBlock = 0

    // @ts-ignore
    this.interval = 0 as NodeJS.Timeout
    this.targetObservable = targetObservable
  }

  private async fetchTxs(startBlock: number): Promise<EVMTokenTransferEventResponse> {
    const resp = await axios.get(this.props.nodeURL + "/api", {
      params: {
        module: "account",
        action: "tokentx",
        address: this.props.recipient,
        startblock: startBlock,
        sort: "desc",
        apikey: this.props.apiKey,
      },
    })
    return resp.data
  }

  private async fetchLastBlock(): Promise<number> {
    const resp = await axios.get(this.props.nodeURL + "/api", {
      params: {
        module: "block",
        action: "getblocknobytime",
        timestamp: _.floor(new Date().valueOf() / 1000),
        closest: "before",
        apikey: this.props.apiKey,
      },
    })
    const blockNumber = resp.data as ExplorerApiResponse<string>
    console.log({ blockNumber, resp })
    return Number(blockNumber.result)
  }

  private async updateCachedTxs(startBlock: number) {
    const response = await this.fetchTxs(startBlock)
    console.log({ resp: response.result, response })

    this.cachedTxs = response.result
  }

  async awaitForDeposit() {
    const { lastBlock } = this

    if (this.cachedTxs.length === 0) {
      await this.updateCachedTxs(lastBlock)
      return
    }

    await this.updateCachedTxs(lastBlock)

    for (let i = 0; i < this.cachedTxs.length; i++) {
      const cachedTx = this.cachedTxs[i]

      console.log({ cachedTx }, cachedTx.value, cachedTx.to)
      console.log(this.props.amount, this.props.recipient)

      console.log(cachedTx.value !== this.props.amount, cachedTx.value, this.props.amount)
      if (cachedTx.value !== this.props.amount) {
        continue
      }

      console.log(cachedTx.to !== this.props.recipient, cachedTx.to, this.props.recipient)
      if (cachedTx.to.toLowerCase() !== this.props.recipient.toLowerCase()) {
        continue
      }

      this.targetObservable.next(cachedTx)
      this.unwatch()
      return
    }
    // https://api.polygonscan.com/api?module=account&action=tokentx&address=0xCed486E3905F8FE1E8aF5d1791F5E7Ad7915f01a&startblock=16818092&sort=desc&apikey=YourApiKeyToken
  }

  async watch() {
    const watcher = this.awaitForDeposit.bind(this)

    this.interval = setInterval(watcher, this.props.timeout)

    this.lastBlock = await this.fetchLastBlock()
    console.log({ block: this.lastBlock })
    // await this.awaitForDeposit()
  }

  unwatch() {
    clearInterval(this.interval)
  }
}
