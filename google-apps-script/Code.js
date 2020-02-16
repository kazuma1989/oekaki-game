/// <reference path="./gas.d.ts" />

/**
 * @returns {ContentService}
 */
function doGet({ parameter: { version, page, perPage } }) {
  let values
  switch (version) {
    case 'v2':
      values = v2({
        page: parseInt(page) || undefined,
        perPage: parseInt(perPage) || undefined,
      })
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
