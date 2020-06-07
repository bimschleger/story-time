/*

Immediately returns a story with existing variables.

@return storyObject {object} 

*/

function doGet() {
  
  let storyParts = getStoryValues();
  Logger.log(storyParts);
  
  let storyObject = compileStory(storyParts);
  Logger.log("message: " + storyObject.story)

  return ContentService.createTextOutput(JSON.stringify(storyObject)).setMimeType(ContentService.MimeType.JSON);   
}


/*

Accept the custom inputs form the user, add them to the appropriate sheet, return them in a story

@param e {object} event containing incoming parameters
@return storyObject {object} 

*/

function doPost(e) {

  // Basic setup for the rest of the function
  let spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1vtmWWWKqrJm7NtScJPuj-iCld9i3ls3SsCfQDJpPcfY/edit?usp=sharing';
  let ss = SpreadsheetApp.openByUrl(spreadsheetUrl);
  let sheetNames = getSheetNames(ss);
  let storyParts = {}
  
  // Assigns values from the  inbound JSON
  let name1 = e.parameter.name;
  let job1 =  e.parameter.job1;
  let food1 = e.parameter.food1;
  
  storyParts.name1 = name1;
  storyParts.job1 = job1;
  storyParts.food1 = food1;

  // Check to see if the sheetName is already in the storyParts object
  let sheetNamesNeeded = [];
  
  sheetNames.forEach(function(sheet) {
    if (!Object.keys(storyParts).includes(sheet)) {
      sheetNamesNeeded.push(sheet);
    }
  });
  
  let message = {"test": "testvalue"};
  return ContentService.createTextOutput(JSON.stringify(message)).setMimeType(ContentService.MimeType.JSON);   
   

  // accept a name, job, and food
  // get phrase1, phrase2, and phrase3
  
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

@param ss {object} The entire spreadsheet object.
@return sheetNames {array} Array containing the names of each sheet

*/

function getSheetNames(ss) {
  Logger.log("Started getSheetNames function");
  
  let sheets = ss.getSheets();
  let sheetNames = [];
  
  // Add the name of each sheet to an the "sheetNames" array.
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
  
  // Access specific spreadsheet by name
  let sheet = ss.getSheetByName(sheetName);
  Logger.log("Got sheet (" + sheetName + ")");
  
  // Prepare variables necessary for getting values
  let rowsMax = sheet.getLastRow();
  let rowsData = rowsMax -1;
  let startingRow = 2;
  let startingColumn = 1;
  Logger.log("Got (" + rowsData + ") rows for sheet (" + sheetName + ").");
  
  // Get values from the sheet
  let values = sheet.getRange(startingRow, startingColumn, rowsData).getValues();
  Logger.log(sheetName + " values length: " + rowsData);
  
  // Select single value from data
  let index = Math.floor(Math.random() * rowsData);
  
  // .getValues is a little funky, returns a 2D array. 
  // Must specify desired row and column, even if only one column.
  let value = values[index][0];
  Logger.log(sheetName + " value = " + value);
  
  return value;
  
}


/*

Takes parts of a story and concatenates them into asingle string.

@param storyParts {object} Collection of variables and phrases that comprise the story
@return storyObject {object} Concatenated story

*/

function compileStory(storyParts) {
  let phrase1 = storyParts.phrase1;
  let name1 = storyParts.name1;
  let phrase2 = storyParts.phrase2;
  let job1 = storyParts.job1;
  let phrase3 = storyParts.phrase3;
  let food1 = storyParts.food1;
  
  let message1 = phrase1 + name1 + ". ";
  let message2 = name1 + " " + phrase2 + " " + job1 + ". ";
  let message3 = name1 + " " + phrase3 + " " + food1;
  let messageTotal = message1 + message2 + message3;
  
  let storyObject = {
    story: messageTotal
  }
  return storyObject;
}