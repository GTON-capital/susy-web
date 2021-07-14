import BN from "bn.js"

function getDelimiters() {
  return [".", ","]
}

export function castFloatToDecimalsVersion(amnt: string, dec: number = 0): BN {
  let amount = amnt,
    decimals = dec
  if (decimals <= 0) return new BN(amnt)
  const delimiters = getDelimiters()

  if (typeof amount === "string" && delimiters.some((del) => amnt.includes(del))) {
    const [delim] = delimiters.filter((delim) => amount.includes(delim))

    const intPart = amount.slice(0, amount.indexOf(delim))
    const precise = amount.slice(amount.indexOf(delim) + 1)
    const decimalsAfter = precise.length

    decimals -= decimalsAfter
    amount = intPart + precise

    if (decimals < 0) {
      decimals += decimalsAfter
      amount = amount.slice(0, amount.length - 2)
    }
  }

  let bnAmount = new BN(amount)
  let base = new BN(10)
  let power = new BN(decimals)
  let multiplier = base.pow(power)
  bnAmount = bnAmount.mul(multiplier)

  return bnAmount
}

export function castToDecimalsVersion(amount: number, decimals: number): BN {
  let bnAmount = new BN(amount)
  let base = new BN(10)
  let power = new BN(decimals)
  let multiplier = base.pow(power)
  bnAmount = bnAmount.mul(multiplier)

  return bnAmount
}

export function castFromDecimalsVersion(amount: number, decimals: number): BN {
  let bnAmount = new BN(amount)
  let base = new BN(10)
  let power = new BN(decimals)
  let multiplier = base.pow(power)
  bnAmount = bnAmount.div(multiplier)

  return bnAmount
}
