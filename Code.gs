// Testing out the ability to return a simple payload.

function doGet() {
  
//  let testResponse = {
//    "name": "Brian",
//    "job": "balloon magician"
//  }
//  
//    return ContentService.createTextOutput(JSON.stringify(testResponse)).setMimeType(ContentService.MimeType.JSON); 
  
  let content = getStoryValues();
  Logger.log(content);
  
//  let test = ContentService.createTextOutput(JSON.stringify(content)).setMimeType(ContentService.MimeType.JSON);
//  Logger.log(test);
//  
  return ContentService.createTextOutput(JSON.stringify(content)).setMimeType(ContentService.MimeType.JSON);   

}


/* 

Creates the JSON object that contains the values for our story

@param ss {object} The entire spreadsheet in which we will operate.
@return content {object} JSON object containing keys and values for our story.

*/

function getStoryValues() {
  
  let spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1vtmWWWKqrJm7NtScJPuj-iCld9i3ls3SsCfQDJpPcfY/edit?usp=sharing';
  let ss = SpreadsheetApp.openByUrl(spreadsheetUrl);
  let sheetNames = getSheetNames(ss);
  
  Logger.log("All sheet names are: " + sheetNames);
  
  // Empty object into which we'll add keys and values
  var storyContent = {}
  
  // Get a single value from each sheet and add the key/value to the content object
  sheetNames.forEach(function(key) {
    
    Logger.log("Started forEach loop");
    
    let value = getSheetValue(ss, key);
    storyContent[key] = value;
    
    Logger.log("Added content: Key (" + key + ") and value (" + value +")");
  });
  
  Logger.log("Completed forEach loop.")
  
  return storyContent;
}


/*

Returns the names of all of the sheets in the spreadsheet.

@return sheetNames {array} Array containing the names of each sheet

*/

function getSheetNames(ss) {
  Logger.log("Started getSheetNames function");
  
  let sheets = ss.getSheets();
  let sheetNames = [];
  
  for(i in sheets) {
    let sheetName = sheets[i].getName();
    sheetNames.push(sheetName);
    
    Logger.log("Pushed sheetName: " + sheetName);
  };
  
  return sheetNames;
}


/* Gets one value the variable on particular sheet

@paramn ss {object} the spreadsheet object in which all of the sheets live;
@param sheetName {string} The name of the spradsheet that we want to grab data from.
@return value {string} The random value from the specified sheet that we'll use for the story

*/

function getSheetValue(ss, sheetName) {
  
  let sheet = ss.getSheetByName(sheetName);
  Logger.log("Got sheet ~" + sheetName + "~ by name");
  
  // Determine number of rows in data set
  let rowsMax = sheet.getLastRow();
  let rowsData = rowsMax -1;
  Logger.log("Got (" + rowsData + ") rows for sheet (" + sheetName + ").");
  
  
  
  // Get values for data
  let startingRow = 2;
  let startingColumn = 1;
  
  let values = sheet.getRange(startingRow, startingColumn, rowsData).getValues();
  
  Logger.log(sheetName + " values length: " + rowsData);
  
  // Select single value from data
  let index = Math.floor(Math.random() * rowsData);
  
  // .getValues is a little funky, returns a 2D array. Must specify desired row and column, even if only one column.
  let value = values[index][0];
  Logger.log("Value is a " + typeof value);
  
  Logger.log(sheetName + " value = " + value);
  
  return value;
  
}