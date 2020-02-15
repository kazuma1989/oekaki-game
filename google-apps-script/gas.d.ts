declare const ContentService: ContentService
declare const SpreadsheetApp: SpreadsheetApp

interface ContentService {
  MimeType: {
    JSON: MimeType
  }

  createTextOutput(value: string): ContentService

  setMimeType(type: MimeType): ContentService
}

interface SpreadsheetApp {
  getActive(): Spreadsheet
}

interface Spreadsheet {
  getSheetByName(name: string): Sheet
}

interface Sheet {
  getDataRange(): Range
}

interface Range {
  getValues(): (number | boolean | Date | string)[][]
}
