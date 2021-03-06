import { PublicKey } from "@solana/web3.js"
import BN from "bn.js"
import bs58 from "bs58"
import Web3 from "web3"
import { base58Decode, base16Encode } from "@waves/ts-lib-crypto"

import { IBPortABI } from "~/contracts/ibport"
import { LUPortABI } from "~/contracts/luport"
import { ERC20ABI } from "~/contracts/erc20"
import { castFloatToDecimalsVersion } from "~/misc/bn"

declare global {
  interface Window {
    ethereum: any
    web3: any
  }
}

export class Web3Invoker {
  contractsABI = {
    IBPortABI,
    LUPortABI,
    ERC20ABI,
  }

  wavesToBytes32(receiver: string | null) {
    if (!receiver) {
      return null
    }
    const receiverBytes = base58Decode(receiver)
    const receiverHex = "0x" + base16Encode(receiverBytes).padEnd(64, "0")
    return receiverHex
  }

  async approve(spender: string, token: string, amount: string) {
    const web3Obj = new Web3(window.ethereum)
    await window.ethereum.enable()

    // @ts-ignore
    const contract = new web3Obj.eth.Contract(JSON.parse(this.contractsABI.ERC20ABI), token)

    await contract.methods.approve(spender, amount).send({ from: await this.resolveCurrentAddress() })
  }

  async getBalanceAndAllowance(address: string, token: string, ibport: string) {
    const web3Obj = new Web3(window.ethereum)
    await window.ethereum.enable()

    // @ts-ignore
    const contract = new web3Obj.eth.Contract(JSON.parse(this.contractsABI.ERC20ABI), token)
    const balance = await contract.methods.balanceOf(address).call()
    // const allowance = await contract.methods.allowance(address, ibport).call()

    return { balance }
  }

  async invokeSendUnlockRequest(receiver: string | null, { value: amountValue, type: amountType }: { value: string; type: "bigint" | undefined }, smartContract: string) {
    const web3Obj = new Web3(window.ethereum)
    await window.ethereum.enable()

    // @ts-ignore
    const contract = new web3Obj.eth.Contract(JSON.parse(this.contractsABI.IBPortABI), smartContract)

    let bnAmount = castFloatToDecimalsVersion(amountValue, 18)

    console.log({ bnAmount: bnAmount.toString(), bnAmountOrig: bnAmount, ctx: this, eth: window.web3.eth, accs: window.web3.eth.accounts })

    const sendRequest = await contract.methods
      .createTransferUnwrapRequest(bnAmount.toString(), this.wavesToBytes32(receiver))
      // @ts-ignore
      .send({ from: await this.resolveCurrentAddress() })
  }

  async invokeLUPortLock(receiver: PublicKey, { value: amountValue }: { value: string; type: "bigint" | undefined }, smartContract: string) {
    const web3Obj = new Web3(window.ethereum)
    await window.ethereum.enable()

    // @ts-ignore
    const contract = new web3Obj.eth.Contract(JSON.parse(this.contractsABI.LUPortABI), smartContract)

    const bnAmount = castFloatToDecimalsVersion(amountValue, 18)

    // console.log({ bnAmount: bnAmount.toString(), bnAmountOrig: bnAmount, ctx: this, eth: window.web3.eth, accs: window.web3.eth.accounts })

    await contract.methods
      .createTransferUnwrapRequest(bnAmount.toString(), receiver.toBytes())
      // @ts-ignore
      .send({ from: await this.resolveCurrentAddress() })
  }

  async resolveCurrentAddress() {
    return new Promise(async (resolve) => {
      const accs = await window.web3.eth.getAccounts()
      accs.forEach((account: string) => resolve(account))
    })
  }
}

class Web3WalletConnector {
  ethEnabled(): boolean {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      window.ethereum.enable()
      return true
    }
    return false
  }
}

export default Web3WalletConnector
