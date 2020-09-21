import {
  WavesKeeperTransaction,
  WavesKeeper,
  WavesKeeperAccount,
} from './types'
import { waitForTx, broadcast } from '@waves/waves-transactions'
import { TInvokeScriptCallArgument } from '@waves/ts-types'

enum LoginType {
  WEB_KEEPER = 0,
  KEEPER,
  NONE,
}
declare global {
  interface Window {
    WavesKeeper: any
  }
}

export class LUPortInvoker {
  keeper: Keeper

  constructor(keeper: Keeper) {
    this.keeper = keeper
  }

  async sendTransferRequest({
    dApp,
    receiver,
    swapAssetID,
    swapAmount,
  }: {
    dApp: string
    receiver: string
    swapAmount: number
    swapAssetID: string
  }) {
    const plugin = await this.keeper.getPlugin()

    console.log({ plugin })

    if (!plugin) {
      return
    }


    const tx: WavesKeeperTransaction = {
      type: 16,
      data: {
        fee: {
          assetId: 'WAVES',
          tokens: '0.005',
        },
        dApp: dApp,
        call: {
          function: 'createTransferWrapRq',
          args: [{ type: 'string', value: receiver }],
        },
        payment: [{ tokens: String(swapAmount), assetId: swapAssetID }],
      },
    }

    console.log({ tx })

    const result = await plugin.signAndPublishTransaction(tx)    
    return result
  }
}

export default class Keeper {
  dal: any
  onUpdate: null | ((address: string) => void)
  fee: number
  _isAvailable: boolean | null
  _address: string | null
  _pageStart: number
  _checkerInterval: null | NodeJS.Timeout
  _loginType: LoginType

  constructor() {
    // this.dal = dal;
    this.onUpdate = null
    this.fee = 0.009

    this._isAvailable = null
    this._address = null
    this._pageStart = Date.now()
    this._checkerInterval = null
    this._loginType = LoginType.NONE

    this._buildTransaction = this._buildTransaction.bind(this)

    this._addressChecker = this._addressChecker.bind(this)
  }

  setWebKeeperAuthType() {
    this._loginType = LoginType.WEB_KEEPER
  }

  setKeeperAuthType() {
    this._loginType = LoginType.KEEPER
  }

  resetAuthType() {
    this._loginType = LoginType.NONE
  }

  isAuthByWebKeeper() {
    return this._loginType === LoginType.WEB_KEEPER
  }

  isAuthByKeeper() {
    return this._loginType === LoginType.KEEPER
  }

  isNotLoggedIn() {
    return this._loginType === LoginType.NONE
  }

  async start() {
    if (this._checkerInterval) {
      clearInterval(this._checkerInterval)
    }

    if (!this.isAuthByKeeper()) {
      return
    }

    this._address = await this.getAddress()

    this._checkerInterval = setInterval(this._addressChecker, 1000)
  }

  stop() {
    this._address = null

    if (this._checkerInterval) {
      clearInterval(this._checkerInterval)
    }
  }

  async isInstalled() {
    const keeper = await this.getPlugin()
    return !!keeper
  }

  async getAccount(): Promise<WavesKeeperAccount | null> {
    const keeper = await this.getPlugin()

    if (!keeper) {
      return null
    }

    try {
      const userData = await keeper.publicState()
      return userData.account
    } catch {
      return null
    }
  }

  async getAddress() {
    const account = await this.getAccount()

    if (!account) {
      return null
    }

    return account.address
  }

  async getPlugin(): Promise<WavesKeeper | undefined> {
    const checker = <T>(resolve: (result: T | undefined) => void) => {
      if (
        this._isAvailable === true ||
        (Date.now() - this._pageStart > 2000 &&
          window.WavesKeeper &&
          window.WavesKeeper.publicState)
      ) {
        this._isAvailable = true
        setTimeout(() => resolve(window.WavesKeeper))
      } else if (
        this._isAvailable === false ||
        Date.now() - this._pageStart > 5000
      ) {
        this._isAvailable = false
        resolve(undefined)
      } else if (this._isAvailable === null) {
        setTimeout(() => checker(resolve), 100)
      }
    }

    return new Promise(checker)
  }

  mapInvokeTxArgs(args: Array<string | number>) {
    return args.map((argument) => ({
      type:
        (typeof argument === 'string' && 'string') ||
        (typeof argument === 'number' && 'integer') ||
        (typeof argument === 'boolean' && 'boolean'),
      value: argument,
    })) as Array<TInvokeScriptCallArgument<number>>
  }

  async sendTransaction(
    dApp: string,
    method: string,
    args: Array<string | number>,
    paymentCurrency: string,
    paymentAmount: number,
    waitTx: boolean = true
  ) {
    const builtTransaction = this._buildTransaction(
      dApp,
      method,
      args,
      paymentCurrency,
      paymentAmount
    )

    const keeper = await this.getPlugin()

    const result = await keeper?.signAndPublishTransaction(builtTransaction)

    if (result) {
      if (!waitTx) {
        return result
      }

      const tx = JSON.parse(result)
      return waitForTx(tx.id, {
        apiBase: this.dal.nodeUrl,
        timeout: 10000,
      }).then(() => result)
    }
    return result
  }

  async signTransaction(
    pairName: string,
    contractName: string,
    method: string,
    // args: Array<TInvokeScriptCallArgument<TLong>>,
    args: Array<string | number>,
    paymentCurrency: string,
    paymentAmount: number
  ) {
    const keeper = await this.getPlugin()
    const dApp = this.dal.contracts[pairName][contractName]

    return keeper?.signTransaction(
      this._buildTransaction(dApp, method, args, paymentCurrency, paymentAmount)
    )
  }

  _buildTransaction(
    dApp: string,
    method: string,
    args: Array<string | number>,
    paymentCurrency: string,
    paymentAmount: number
  ) {
    const transaction: WavesKeeperTransaction = {
      type: 16,
      data: {
        fee: {
          assetId: 'WAVES',
          tokens: String(this.fee),
        },
        dApp,
        call: {
          args: args.map((item) => ({
            type: !isNaN(Number(item)) ? 'integer' : 'string',
            value: typeof item === 'object' ? JSON.stringify(item) : item,
          })),
          function: method,
        },
        payment: !paymentAmount
          ? []
          : [
              {
                assetId: paymentCurrency || 'WAVES',
                tokens: String(paymentAmount),
              },
            ],
      },
    }
    if (process.env.NODE_ENV !== 'production') {
      console.log('Transaction:', transaction) // eslint-disable-line no-console
      console.log('Transaction:', JSON.stringify(transaction))
    }
    return transaction
  }

  // async broadcastAndWait(tx: ) {
  //     if (_isString(tx)) {
  //         tx = JSON.parse(tx);
  //     }
  //     await broadcast(tx, this.dal.nodeUrl);
  //     await waitForTx(tx.id, { apiBase: this.dal.nodeUrl });
  // }
  // async broadcast(tx) {
  //     if (_isString(tx)) {
  //         tx = JSON.parse(tx);
  //     }
  //     return broadcast(tx, this.dal.nodeUrl);
  // }

  // async waitForTx(tx) {
  //     if (_isString(tx)) {
  //         tx = JSON.parse(tx);
  //     }
  //     return waitForTx(tx.id, { apiBase: this.dal.nodeUrl });
  // }

  async _addressChecker() {
    // Get next address

    const address = await this.getAddress()

    if (this._address && address && this._address !== address) {
      this._address = address

      if (this.onUpdate) {
        this.onUpdate(this._address)
      }
    }
  }
}
