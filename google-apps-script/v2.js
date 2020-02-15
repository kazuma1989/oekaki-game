// @ts-check
/// <reference path="./gas.d.ts" />

/**
 * @returns {import('../src/APIGetSheetValues').Response}
 */
function v2() {
  const rawValues = SpreadsheetApp.getActive()
    .getSheetByName('お題')
    .getDataRange()
    .getValues()

  return (
    rawValues
      // ヘッダーを除外
      .slice(1)
      .map(([mainText, subText, forTutorial, disabled]) => {
        if (disabled || (!mainText && !subText)) {
          return null
        }

        return {
          mainText: mainText.toString(),
          subText: subText ? subText.toString() : undefined,
          forTutorial: forTutorial ? true : undefined,
        }
      })
      .filter(nonNull)
  )
}

function nonNull(value) {
  return value !== null && value !== undefined
}
