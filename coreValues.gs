/*
*

Get all of the person objects that we need for the story.

@param story {object} our core story object
@param sheetName {string} the name of the sheet form which we want to read.
@param userInput {string} A name that the user optionally provides.
@return peopleArray {array} array of person objects, with one object for each person that is in the story. 

*
*/

function getCoreObject(story, sheetName, userInput = null) {
  
  var sheet = getSheetData(sheetName);
  var value;
  
  if (userInput != null) { // If there is a user input, check to see if the input exists
    value = getSpecificValueFromSheet(sheet, userInput); //if the value exists, generate an object from it
    
    if (value === null) {  // if the value does not exist, add teh value to the sheet and make an object from it
      value = addNewValueToSheet(sheet, userInput)
    } 
    
  } else {
      value = getRandomValueFromSheet(sheet); // just get any random value from the sheet
  }
  
  // If the variable object already has been added to story, run again and get a different variable.
  storyObjectIds = story[sheetName].map(value => value.id);
  
  if (storyObjectIds.indexOf(value.id) != -1) {
    Logger.log("Detected duplicate value: '" + value.name + "'.");
    getCoreObject(story, sheetName);
  }
  
  // Add the value to the story object
  story[sheetName].push(value);
  Logger.log(JSON.stringify(story));
  
  return story;
}


/*
*

Get the object for an existing value in the spreadsheet

@param sheet {object} the entire spreadsheet object
@param value {string} the user input to look for in the Google Sheets
@return coreObject {object} The core id/name object

*
*/

function getSpecificValueFromSheet(sheet, value) {
  
  Logger.log("Started 'getSpecificValueFromSheet()'");
  
  // Prepare variables necessary for getting values
  let rowsMax = sheet.getLastRow();
  let numRows = rowsMax -1;
  let startingRow = 2;
  let startingColumn = 1;
  let numColumns = 2
  
  // Get value from the sheet
  let values = sheet.getRange(startingRow, startingColumn, numRows, numColumns).getValues();
  let matchingArray = values.filter(row => row[1] === value);  // generates a 2D array of rows
  Logger.log("Matches with values: " + matchingArray);
  Logger.log(matchingArray);
  
  
  // Check if there is a match or not
  if (matchingArray.length === 0) {
    return null;
  }
  else {
    // Get the one matching array  the filtered data.
    let matchingValue = matchingArray[0];
    Logger.log(matchingValue);
    let coreObject = newCore(matchingValue[0],matchingValue[1]);
    
    Logger.log("Got existing value: " + JSON.stringify(coreObject));
    
    return coreObject;
  }
}


/*
*

Add a single value to a particular spreadsheet.

@param sheetName {string} Name of the sheet to which the system writes the value
@param value {string} Value that the system will append to the last row of the specified sheet
@return coreObject {object} The core id/name object

*
*/

function addNewValueToSheet(sheet, value) {
  
  Logger.log("Started 'addNewValueToSheet'.");
  
  let lastRow = sheet.getLastRow();
  let insertRow = lastRow + 1;
  let insertColumn = 1;
  let numRows = 1;
  let numColumns = 2;
  
  // 2D array to use within .setValues
  let rowData = [[lastRow, value]];
  
  // Add the value to the appropriate sheet
  sheet.getRange(insertRow, insertColumn, numRows, numColumns).setValues(rowData);
  Logger.log("Inserted into '" + sheet + "' the value '" + value + "'.");
  
  let coreObject = newCore(lastRow, value);
  Logger.log("Created the object '" + JSON.stringify(coreObject) + "'");
  
  return coreObject;
  
}


/* 
*

Gets one value the variable on a particular sheet

@param sheetName {string} The name of the spradsheet that we want to grab data from.
@return value {string} The random value from the specified sheet that we'll use for the story

*
*/

function getRandomValueFromSheet(sheet) {
  Logger.log("Started 'getRandomValueFromSheet'");
  
  // Prepare variables necessary for getting values
  let rowsMax = sheet.getLastRow();
  let numRows = rowsMax -1;
  let startingRow = 2;
  let startingColumn = 1;
  let numColumns = 2
  
  // Get value from the sheet
  let values = sheet.getRange(startingRow, startingColumn, numRows, numColumns).getValues();
  // Logger.log("Got values: " + values);
  
  // Select single value from data
  let index = Math.floor(Math.random() * numRows);
  // Logger.log("Got random index '" + index + "'");
  
  // .getValues is a little funky, returns a 2D array. 
  // Must specify desired row and column, even if only one column.
  let value = values[index];
  
  let coreObject = newCore(value[0], value[1]);
  Logger.log("Got random '" + sheet + "' object: '" + JSON.stringify(coreObject) + "'." );
  
  return coreObject;
}


/*
*

Get an array of the unique xVariables in use within story.message.raw

@param rawMessage {string} story.message.raw
@param xVariableRegex {string} regex value
@return uniqueXVariables {array} array of unique xVariables fir a specifuc type (e.g. person)

*
*/

function getUniqueXVariables(rawMessage) { // rawMessage = null
  
  var xVariableObject = {
    "names": {
      "regex": /xName[1-9]{1,2}/g,
      "uniques": []
    },
    "foods": {
      "regex": /xFood[1-9]{1,2}/g,
      "uniques": []
    },
    "jobs": {
      "regex": /xJob[1-9]{1,2}/g,
      "uniques": []
    },
    "adjectives": {
      "regex": /xAdj[1-9]{1,2}/g,
      "uniques": []
    }
  }
 
  Object.keys(xVariableObject).forEach(function (key) {  
    
    // Gets the values within story.message.raw that match regex values
    let matchKeyArray = rawMessage.match(xVariableObject[key].regex);
    Logger.log("All results for '" + key + "': " + matchKeyArray);
    
    let uniques = [];
    
    // Loops through the regex matched values for each xVariable key
    // Adds unique values to the xVariablesObject
    if (matchKeyArray != null) {  // Prevents an error for null values, like xVariableAdj which I have not implemented yet.
      for (var i of matchKeyArray) {
        if (xVariableObject[key].uniques.indexOf(i) === -1) {
          xVariableObject[key].uniques.push(i)
          Logger.log("Added '" + i + "' to unique '" + key + "' values.");
        }
      }
      Logger.log("Found " + xVariableObject[key].uniques.length + " unique results for '" + key + "': " + xVariableObject[key].uniques);
    }
  });
  Logger.log("Added all unique values to xVariableObject.");
  
  return xVariableObject;
}