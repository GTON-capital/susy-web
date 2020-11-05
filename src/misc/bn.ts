import BigNumberImpl from "bignumber.js";


export function castToDecimalsVersion(amount: number, decimals: number): BigNumberImpl {
  let bnAmount = new BigNumberImpl(amount)
  let base = new BigNumberImpl(10)
  let power = new BigNumberImpl(decimals)
  let multiplier = base.pow(power)
  bnAmount = bnAmount.multipliedBy(multiplier)

  return bnAmount
}

export function castFromDecimalsVersion(amount: number, decimals: number): BigNumberImpl {
  let bnAmount = new BigNumberImpl(amount)
  let base = new BigNumberImpl(10)
  let power = new BigNumberImpl(decimals)
  let multiplier = base.pow(power)
  bnAmount = bnAmount.dividedBy(multiplier)

  return bnAmount
}