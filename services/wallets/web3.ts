import Web3 from 'web3'


import { IBPortABI } from '~/contracts/ibport'

declare global {
  interface Window {
    ethereum: any
    web3: any
  }
}


export class Web3Invoker {
  contractsABI = {
    IBPortABI,
  }

  async invokeSendUnlockRequest(
    receiver: string | null,
    { value: amountValue, type: amountType }: { value: number; type: 'bigint' | undefined },
    smartContract: string
  ) {
    const web3Obj = new Web3(window.ethereum)
    await window.ethereum.enable()

    // @ts-ignore
    const contract = new web3Obj.eth.Contract(
      JSON.parse(this.contractsABI.IBPortABI),
      smartContract,
      {
        gas: 100000,
      }
    )
    // createTransferUnwrapRequest
    console.log({ contract, web3Obj })

    const { BN } = window.web3.utils

    amountValue = new BN(amountValue, 10)

    if (!amountType) {
      let qtr = new BN(10, 10)
      let power = new BN(18, 10)

      qtr = qtr.pow(power)
      
      // @ts-ignore
      amountValue = amountValue.mul(qtr)
    }


    console.log({ amountValue, ctx: this, eth: window.web3.eth, accs: window.web3.eth.accounts })

    const resolveCurrentAddress = () => new Promise(async resolve => {
      const accs = await window.web3.eth.getAccounts();
      accs.forEach((account: string) => resolve(account))
    })

    const sendRequest = await contract.methods
      .createTransferUnwrapRequest(amountValue, receiver) 
      // @ts-ignore
      .send({ from: await resolveCurrentAddress() })

    console.log({ sendRequest })
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
