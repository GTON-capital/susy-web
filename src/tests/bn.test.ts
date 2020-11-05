import BN from 'bn.js'
import assert from 'assert'

import {
  castFloatToDecimalsVersion,
} from '../misc/bn';

/**
 *
 * bn.js does not support float number as input
 *
 */
describe('Test for BN correct mapping: castFloatToDecimalsVersion', () => {
  // input - result
  type BNInputOutputData = number | string | number[] | Uint8Array | Buffer | BN
  type BNTestCase = [BNInputOutputData, CastFloatToDecimalProps]

  type CastFloatToDecimalProps = [string, number]

  
  const testCases: BNTestCase[] = [
    ['102', ['102', 0]],
    ['200', ['0.002', 5]],
    ['300', ['0.003', 5]],
    ['1', ['1', 0]],
    ['10', ['1', 1]],
    ['100000', ['10', 4]],
    ['300000', ['0.00003', 10]]
, ]

  for (let i = 0; i < testCases.length; i++) {
    const caseNumber = i + 1
    const testCase = testCases[i]
    const [expected, inputProps] = testCase

    it(`Test case #${caseNumber}`, () => {
      const result = castFloatToDecimalsVersion(inputProps[0] as string, inputProps[1] as number | undefined)

      assert.strictEqual(expected.toString(), result.toString())
    })
  }
})

