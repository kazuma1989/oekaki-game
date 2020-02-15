// @ts-check
/// <reference path="./gas.d.ts" />

/**
 * @returns {ContentService}
 */
function doGet() {
  const rawValues = SpreadsheetApp.getActive()
    .getSheetByName('お題')
    .getDataRange()
    .getValues()

  /** @type {import('../src/APIGetSheetValues').Response} */
  const values = rawValues
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

  return ContentService.createTextOutput(JSON.stringify(values)).setMimeType(
    ContentService.MimeType.JSON,
  )
}

function nonNull(value) {
  return value !== null && value !== undefined
}
