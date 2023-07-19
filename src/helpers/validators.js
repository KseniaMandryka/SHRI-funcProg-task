import {__, countBy, dissoc, gte} from "ramda"

const equals = target => value => value === target

const prop = key => obj => obj[key]

const compose = (...fns) => {
  return arg => {
    return fns.reduceRight((acc, fn) => fn(acc), arg)
  }
}

function allPass(fns) {
  return arg => fns.every(fn => fn(arg))
}

function complement(fn) {
  return function(args) {
    return !fn(args)
  }
}

function any(...fns) {
  return arg => fns.some(fn => fn(arg))
}

const values = (obj) => Object.values(obj)

const identity = arg => arg

const propEq = (key, value) => obj => obj[key] === value


const numberOfColors = compose(countBy(identity), values)

const circle = prop('circle')
const square = prop('square')
const triangle = prop('triangle')
const star = prop('star')

const red = equals('red')
const white = equals('white')
const green = equals('green')
const orange = equals('orange')
const blue = equals('blue')

const getGreen = prop('green')
const twoGreens = propEq('green', 2)
const oneReds = propEq('red', 1)


const redStar = compose(red, star)
const whiteTriangle = compose(white, triangle)
const notWhiteTriangle = complement(whiteTriangle)
const allHasColor = color => compose(propEq(color, 4), numberOfColors)


// 1. Красная звезда, зеленый квадрат, все остальные белые.
const isWhiteCircle = compose(white, circle)
const isGreenSquare = compose(green, square)
export const validateFieldN1 = allPass([redStar, isGreenSquare, whiteTriangle, isWhiteCircle])

// 2. Как минимум две фигуры зеленые.
const numberOfGreenColors = compose(getGreen, numberOfColors)
export const validateFieldN2 = compose(gte(__, 2), numberOfGreenColors)

// 3. Количество красных фигур равно кол-ву синих.
const redEqualsBlue = ({blue, red}) => blue === red
export const validateFieldN3 = compose(redEqualsBlue, numberOfColors)

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
const isBlueCircle = compose(blue, circle)
const isOrangeSquare = compose(orange, square)
export const validateFieldN4 = allPass([redStar, isBlueCircle, isOrangeSquare])

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
const numberOfColorsWhitoutWhite = compose(dissoc('white'), numberOfColors)
const anyValueGreaterOrEqualsThenThree = compose(any(gte(__, 3)), values)
export const validateFieldN5 = compose(anyValueGreaterOrEqualsThenThree, numberOfColorsWhitoutWhite)

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
const twoGreenColors = compose(twoGreens, numberOfColors)
const isGreenTriangle = compose(green, triangle)
const oneRedColor = compose(oneReds, numberOfColors)
export const validateFieldN6 = allPass([isGreenTriangle, twoGreenColors, oneRedColor])

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allHasColor('orange')

// 8. Не красная и не белая звезда, остальные – любого цвета.
const isWhiteStar = compose(white, star)
const isNotWhiteStar = complement(isWhiteStar)
const isNotRedStar = complement(redStar)
export const validateFieldN8 = allPass([isNotRedStar, isNotWhiteStar])

// 9. Все фигуры зеленые.
export const validateFieldN9 = allHasColor('green')

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
const isWhiteSquare = compose(white, square)
const isNotWhiteSquare = complement(isWhiteSquare)
const squareEqualsTriangle = ({square, triangle}) => square === triangle
export const validateFieldN10 = allPass([isNotWhiteSquare, notWhiteTriangle, squareEqualsTriangle])

