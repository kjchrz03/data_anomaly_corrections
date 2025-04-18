function initializeCheckboxes() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var formSubmissions = spreadsheet.getSheetByName('scrub_requests');
  var numRows = formSubmissions.getDataRange().getNumRows();

  // Add checkboxes to the formSubmissions sheet
  var checkboxRange = formSubmissions.getRange(2, 7, numRows - 1, 1);
  var checkboxRule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
  checkboxRange.setDataValidation(checkboxRule);

}
function runAll() {
  initializeCheckboxes();
  transferData();
}


function transferData() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var anomaliesList = spreadsheet.getSheetByName('looker_anomalies');
  var formSubmissions = spreadsheet.getSheetByName('scrub_requests');

  var formSubmissionValues = formSubmissions.getDataRange().getValues();
  var anomaliesValues = anomaliesList.getDataRange().getValues();

  var shouldMoveData = false;
  var valuesToPaste = [];
  var numRows = formSubmissionValues.length;

  var moveBoxIndex = 6;

  // Add checkboxes to the formSubmissions sheet
  var checkboxRange = formSubmissions.getRange(2, 7, numRows - 1, 1);
  var checkboxRule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
  checkboxRange.setDataValidation(checkboxRule);

  // Loop through form submissions
  for (var j = 1; j < numRows; j++) {
    var issueID = formSubmissionValues[j][2];
    var issueLocation = formSubmissionValues[j][3];
    var addDate = formSubmissionValues[j][4];
    var moveBox = formSubmissionValues[j][6];

    // Only move data if the moveBox is unchecked (false)
    if (moveBox === false || moveBox === 'FALSE') {
      shouldMoveData = true;
      valuesToPaste.push([issueID, issueLocation, addDate]);
    }
  }

  // Append new data to the anomalies sheet
  if (shouldMoveData && valuesToPaste.length > 0) {
    var targetRow = anomaliesList.getLastRow();
    anomaliesList.getRange(targetRow + 1, 1, valuesToPaste.length, valuesToPaste[0].length).setValues(valuesToPaste);
    Logger.log('Data copied and sorted successfully!');

    // Set move boxes to true after moving the data
    for (var i = 1; i < numRows; i++) {
      var moveBoxCell = formSubmissions.getRange(i + 1, moveBoxIndex + 1);
      if (moveBoxCell.getValue() === false) {
        moveBoxCell.setValue(true);
      }
    }
  } else {
    Logger.log('No data to copy.');
  }
}
