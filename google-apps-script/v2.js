// @ts-check
/// <reference path="./gas.d.ts" />

/**
 * @returns {import('../src/APIGetSheetValues').Response}
 */
function v2() {
  const dataSheet = SpreadsheetApp.getActive().getSheetByName('data')

  const rawValues = randomPickFrom(
    dataSheet
      .getDataRange()
      .getValues()
      // ヘッダーを除外
      .slice(1),
    100,
  )

  return rawValues.map(([mainText, subText]) => ({
    mainText: mainText.toString(),
    subText: subText ? subText.toString() : undefined,
  }))
}

/**
 * It MUTATES the array in the params
 *
 * @template T
 * @param {T[]} array
 * @param {number} limit
 * @return {T[]} random picked array. length === limit
 */
function randomPickFrom(array, limit) {
  /** @type {T[]} */
  const picked = []

  for (let i = array.length - 1; i > array.length - limit - 1; i--) {
    // swap items
    const indexToPick = Math.floor(Math.random() * (i + 1))
    const pickedItem = array[indexToPick]
    array[indexToPick] = array[i]
    array[i] = pickedItem

    // then pick an item
    picked.push(pickedItem)
  }

  return picked
}
