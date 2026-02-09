function doPost(e){
  const sheet = SpreadsheetApp.openById("ID_SHEET_KAMU")
    .getSheetByName("Sheet1");

  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.nama,
    data.luas,
    data.lantai,
    data.jenis,
    data.material,
    data.total
  ]);

  return ContentService.createTextOutput("OK");
}
