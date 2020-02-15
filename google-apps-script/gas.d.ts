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
  getActive(): any
}
