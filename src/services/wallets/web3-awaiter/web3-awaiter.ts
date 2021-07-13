import { Subject } from "rxjs"
import axios from "axios"

import { EVMTokenTransferEvent, ExplorerApiResponse } from "./types"

type EVMTokenTransferEventResponse = ExplorerApiResponse<EVMTokenTransferEvent[]>

export const PolygonScanAPIKey = "1QUW98DRE3B9PJFVI9MKN58JKEDEW1DEAT"

export type EVMDepositAwaitProps = {
  nodeURL: string
  apiKey: string
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
    this.props = Object.assign({}, props)
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
        timestamp: new Date().valueOf() / 1000,
        closest: "before",
        apikey: this.props.apiKey,
      },
    })
    const blockNumber = resp.data as ExplorerApiResponse<string>
    return Number(blockNumber)
  }

  private async updateCachedTxs(startBlock: number) {
    const response = await this.fetchTxs(startBlock)

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

      if (cachedTx.value !== this.props.amount) {
        continue
      }

      if (cachedTx.to !== this.props.recipient) {
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
  }

  unwatch() {
    clearInterval(this.interval)
  }
}
