function doGet() {
  const output = HtmlService.createTemplateFromFile('index').evaluate()
  output.addMetaTag('viewport', 'width=device-width, initial-scale=1')
  output.setTitle('お絵かき お題当て')

  return output
}

function getValues() {
  return SpreadsheetApp.getActive()
    .getSheetByName('お題')
    .getDataRange()
    .getValues()
}
