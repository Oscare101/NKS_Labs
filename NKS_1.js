const gamma = 0.84
const probability = 511
const intensity = 488
const workToFailureList = [
  766, 137, 105, 124, 63, 356, 67, 113, 325, 10, 291, 271, 199, 90, 146, 461,
  48, 305, 150, 900, 640, 120, 23, 403, 36, 321, 102, 136, 451, 257, 55, 87,
  264, 135, 542, 425, 54, 148, 188, 387, 133, 193, 524, 161, 179, 558, 132, 139,
  74, 23, 71, 140, 131, 168, 159, 97, 31, 625, 34, 111, 452, 12, 26, 234, 543,
  252, 269, 10, 228, 143, 40, 120, 237, 171, 16, 221, 55, 99, 105, 192, 213,
  539, 7, 89, 452, 161, 478, 85, 443, 32, 162, 633, 249, 132, 283, 76, 548, 136,
  322, 107,
]

// Кількість значень
const workLength = workToFailureList.length
console.log('Кількість значень: ', workLength)

// Середній наробіток до відмови Tср
const sum = workToFailureList.reduce((partialSum, a) => partialSum + a, 0)
const average = sum / workLength
console.log('Середній наробіток до відмови Tср: ', average)

// Відсортована вибірка
const sortedList = workToFailureList.sort(function (a, b) {
  return a - b
})
console.log('Відсортована вибірка: ', sortedList)

// Максимальне значення наробітку до відмови
const max = Math.max(...workToFailureList)
console.log('Максимальне значення наробітку до відмови: ', max)

// Довжина інтервалу
const interval = 10
const intervalLength = max / interval
console.log('Довжина інтервалу: ', intervalLength)

// Границі інтервалів
const intervalBounds = []
let startInterval = 0
for (let i = 1; i <= interval; i++) {
  let count = +(intervalLength * i).toFixed(1)

  intervalBounds.push([startInterval, count])
  startInterval = count
}
console.log('Границі інтервалів:')
for (let i = 0; i < intervalBounds.length; i++) {
  console.log(
    i + 1,
    '-й інтервал від',
    intervalBounds[i][0],
    'до',
    intervalBounds[i][1]
  )
}

// значення статистичної щільності розподілу ймовірності відмови:
const elementsAmount = []
let point = 0
for (let i = 0; i < intervalBounds.length; i++) {
  let elementsAmountCounter = 0

  for (let j = 0; j < sortedList.length; j++) {
    //console.log(point, sortedList[j], intervalBounds[i][1])
    if (point < sortedList[j] && sortedList[j] <= intervalBounds[i][1]) {
      elementsAmountCounter += 1
    }
  }
  point = intervalBounds[i][1]
  elementsAmount.push(elementsAmountCounter)
}

const statisticalDensity = []
for (let i = 0; i < elementsAmount.length; i++) {
  let calcDestiny = +(elementsAmount[i] / (100 * intervalLength)).toFixed(6)
  statisticalDensity.push(calcDestiny)
}
console.log('Значення статистичної щільності розподілу ймовірності відмови:')
for (let i = 0; i < statisticalDensity.length; i++) {
  console.log(
    'Для',
    i + 1,
    '-го інтервалу f',
    i + 1,
    ' = ',
    statisticalDensity[i]
  )
}

// Значення статистичної щільності розподілу ймовірності відмови
const statisticalDensityRes = []
let countPart = 0
console.log('Значення статистичної щільності розподілу ймовірності відмови:')
for (let i = 0; i < statisticalDensity.length; i++) {
  let calcRes = 0
  countPart += statisticalDensity[i] * intervalLength
  calcRes = +(1 - countPart).toFixed(6)
  if (calcRes < 0) {
    calcRes = 0
  }
  statisticalDensityRes.push(calcRes)
}
for (let i = 0; i < statisticalDensity.length; i++) {
  console.log(
    'Для',
    i + 1,
    '-го інтервалу P(',
    intervalBounds[i][1],
    ') = ',
    statisticalDensityRes[i]
  )
}

//

const d01 = +(
  (statisticalDensityRes[0] - gamma) /
  (statisticalDensityRes[0] - 1)
).toFixed(2)
// ДОДАТКОВЕ ЗАВДАННЯ:
let stepGamma
for (let i = 0; i < statisticalDensityRes.length; i++) {
  if (gamma > statisticalDensityRes[i]) {
    //перевірка в якому інтервалі знаходиться gamma
    stepGamma = i
    break
  }
}
console.log('d(', +(1 - gamma).toFixed(2), ')', d01)
const tGamma = +(
  intervalBounds[stepGamma][1] -
  intervalBounds[stepGamma][1] * d01
).toFixed(2)
console.log('T(', gamma, ')', tGamma)

//

let index
for (let i = 0; i < intervalBounds.length; i++) {
  if (
    intervalBounds[i][0] <= probability &&
    probability < intervalBounds[i][1]
  ) {
    index = i
  }
}

let calcOut = 1
for (let i = 0; i <= index; i++) {
  if (i < index) {
    calcOut -= statisticalDensity[i] * intervalLength
  } else {
    calcOut -= statisticalDensity[i] * (probability - intervalBounds[i][0])
  }
}
console.log(
  'Ймовірність безвідмовної роботи на час',
  probability,
  'годин:"',
  +calcOut.toFixed(5)
)

const intenseRes = +(statisticalDensity[index] / calcOut).toFixed(6)
console.log('Інтенсивність відмов на час', intensity, 'годин: ', intenseRes)
