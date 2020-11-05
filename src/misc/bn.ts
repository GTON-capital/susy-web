import BigNumber from "bignumber.js";


export function castToDecimalsVersion(amount: number, decimals: number): BigNumber {
  let bnAmount = new BigNumber(amount)
  let base = new BigNumber(10)
  let power = new BigNumber(decimals)
  let multiplier = base.pow(power)
  bnAmount = bnAmount.multipliedBy(multiplier)

  return bnAmount
}

export function castFromDecimalsVersion(amount: number, decimals: number): BigNumber {
  let bnAmount = new BigNumber(amount)
  let base = new BigNumber(10)
  let power = new BigNumber(decimals)
  let multiplier = base.pow(power)
  bnAmount = bnAmount.dividedBy(multiplier)

  return bnAmount
}