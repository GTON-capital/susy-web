import { FormValidationBuilder } from "~/services/misc/form"

export type SwapProps = {
  amount: number
  balance?: number
  metamaskChainIDGetter?: () => Promise<number>
  // address: string2
}

export const SwapError = {
  SilentError: new Error(""),
  InvalidAmount: new Error("Invalid amount passed"),
  InsufficientBalance: new Error("Insufficient balance"),
  InvalidChainID: new Error("Invalid metamask network"),
}

export const formValidatorBuilder: FormValidationBuilder<SwapProps> = (props) => {
  return async function () {
    if (props.metamaskChainIDGetter) {
      const chainID = await props.metamaskChainIDGetter()
      if (chainID !== 137) {
        return SwapError.InvalidChainID
      }
    }
    if (props.amount < 0 || isNaN(props.amount)) {
      return SwapError.InvalidAmount
    }
    if ((props.balance && props.balance < props.amount) || (props.balance && props.balance === 0)) {
      return SwapError.InsufficientBalance
    }

    // if (props.string)

    return null
  }
}
