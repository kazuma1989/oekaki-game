// @ts-check
/// <reference path="./gas.d.ts" />

/**
 * @returns {ContentService}
 */
function doGet({ parameter: { version } }) {
  let values
  switch (version) {
    case 'v2':
      values = v2()
      break

    case 'v1':
    default:
      values = v1()
      break
  }

  return ContentService.createTextOutput(JSON.stringify(values)).setMimeType(
    ContentService.MimeType.JSON,
  )
}

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

/**
 * @returns {(string | number | boolean | Date)[][]}
 */
function v1() {
  return SpreadsheetApp.getActive()
    .getSheetByName('お題')
    .getDataRange()
    .getValues()
}
