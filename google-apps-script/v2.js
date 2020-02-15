// @ts-check
/// <reference path="./gas.d.ts" />

/**
 * @param {Object} param
 * @param {number | undefined} param.page
 * @param {number | undefined} param.perPage
 * @returns {import('../src/APIGetSheetValues').Response}
 */
function v2({ page = 0, perPage = 100 }) {
  if (!(page >= 0)) {
    page = 0
  }
  if (!(0 <= perPage && perPage <= 100)) {
    perPage = 100
  }

  const activeSheet = SpreadsheetApp.getActive()
  const metaSheet = activeSheet.getSheetByName('meta')
  const dataSheet = activeSheet.getSheetByName('お題')

  const offset = perPage * page + 1
  const rawValues = dataSheet.getRange(offset + 1, 1, perPage, 4).getValues()

  const values = rawValues
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

  const totalCount =
    parseInt(
      metaSheet
        .getRange('B1')
        .getValue()
        .toString(),
    ) || 0

  return {
    values,
    totalCount,
    page,
    perPage,
  }
}

function nonNull(value) {
  return value !== null && value !== undefined
}
