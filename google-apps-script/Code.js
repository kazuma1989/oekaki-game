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
