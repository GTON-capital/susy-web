import BigNumber from "bignumber.js";


export function castToDecimalsVersion(amount: number, decimals: number): BigNumber {
  let bnAmount = new BigNumber(amount, 10)
  let base = new BigNumber(10, 10)
  let power = new BigNumber(decimals, 10)
  let multiplier = base.pow(power)
  bnAmount = bnAmount.multipliedBy(multiplier)

  return bnAmount
}

export function castFromDecimalsVersion(amount: number, decimals: number): BigNumber {
  let bnAmount = new BigNumber(amount, 10)
  let base = new BigNumber(10, 10)
  let power = new BigNumber(decimals, 10)
  let multiplier = base.pow(power)
  bnAmount = bnAmount.dividedBy(multiplier)

  return bnAmount
}