// @ts-check
/// <reference path="./gas.d.ts" />

/**
 * @returns {(string | number | boolean | Date)[][]}
 */
function v1() {
  return SpreadsheetApp.getActive()
    .getSheetByName('data')
    .getDataRange()
    .getValues()
}
