import { FormValidationBuilder } from "~/services/misc/form"

export type SwapProps = {
  amount: number
  balance?: number
  // address: string2
}

export const SwapError = {
  InvalidAmount: new Error("Invalid amount passed"),
  InsufficientBalance: new Error("Insufficient balance"),
}

export const formValidatorBuilder: FormValidationBuilder<SwapProps> = (props) => {
  return function () {
    if (props.amount < 0 || isNaN(props.amount)) {
      return SwapError.InvalidAmount
    }
    if (props.balance && props.balance < props.amount) {
      return SwapError.InsufficientBalance
    }
    // if (props.string)

    return null
  }
}
