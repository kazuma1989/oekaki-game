// @ts-check
/// <reference path="./gas.d.ts" />

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify(
      SpreadsheetApp.getActive()
        .getSheetByName('お題')
        .getDataRange()
        .getValues(),
    ),
  ).setMimeType(ContentService.MimeType.JSON)
}
