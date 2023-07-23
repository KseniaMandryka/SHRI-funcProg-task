import Api from '../tools/api'
import { __, andThen, assoc, concat, gt, ifElse, length, lt, mathMod, otherwise, partial, tap, test } from "ramda"


function allPass(fns) {
  return arg => fns.every(fn => fn(arg))
}

const compose = (...fns) => {
  return arg => {
    return fns.reduceRight((acc, fn) => fn(acc), arg)
  }
}

const pipe = (...fns) => {
  return arg => {
    return fns.reduce((acc, fn) => fn(acc), arg)
  }
}

const prop = key => obj => obj[key]


const api = new Api()

const square = num => num ** 2
const gtTwo = gt(__, 2)
const ltTen = lt(__, 10)

const thenSquare = andThen(square)

const lengthGreaterThenTwo = compose(gtTwo, length)
const lengthLowerThenTen = compose(ltTen, length)
const testOnlyNumbers = test(/^[0-9]+\.?[0-9]+$/)
const roundStringToNumber = compose(Math.round, Number)
const modForThreeToString = compose(String, mathMod(__, 3))

const thenModOfThreeToString = andThen(modForThreeToString)
const thenGetLength = andThen(length)

const validate = allPass([lengthGreaterThenTwo, lengthLowerThenTen, testOnlyNumbers])

const assocNumberToBinary = assoc('number', __, { from: 10, to: 2 })

const API_NUMBERS_URL = 'https://api.tech/numbers/base'
const API_ANIMALS_URL = 'https://animals.tech/'
const getApiResult = compose(String, prop('result'))
const thenGetApiResult = andThen(getApiResult)
const thenConcatToAnimalsUrl = andThen(concat(API_ANIMALS_URL))
const thenCallApiWithEmptyParams = andThen(api.get(__, {}))
const apiGetNumberBinaryBase = compose(
  api.get(API_NUMBERS_URL),
  assocNumberToBinary
)

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const tapLog = tap(writeLog)
  const thenTapLog = andThen(tapLog)
  const thenHandleSuccess = andThen(handleSuccess)
  const otherwiseHandleError = otherwise(handleError)

  const handleValidationError = partial(handleError, ['ValidationError'])

  const sequenceComposition = pipe(
    roundStringToNumber,
    tapLog,
    apiGetNumberBinaryBase,
    thenGetApiResult,
    thenTapLog,
    thenGetLength,
    thenTapLog,
    thenSquare,
    thenTapLog,
    thenModOfThreeToString,
    thenTapLog,
    thenConcatToAnimalsUrl,
    thenCallApiWithEmptyParams,
    thenGetApiResult,
    thenHandleSuccess,
    otherwiseHandleError,
  )

  const runWithCondition = ifElse(validate, sequenceComposition, handleValidationError)
  const logAndRunSequence = compose(runWithCondition, tapLog)

  logAndRunSequence(value)
}

export default processSequence
