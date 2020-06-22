/*
*

Get all of the person objects that we need for the story.

@param story {object} our core story object
@param sheetName {string} the name of the sheet form which we want to read.
@param userInput {string} A name that the user optionally provides.
@return peopleArray {array} array of person objects, with one object for each person that is in the story. 

*
*/

function getCoreObject(story = newStory(), sheetName = "foods", userInput = null) { //TODO: remove default values when ready to test.
  
  var sheet = getSheetData(sheetName);
  var value;
  
  if (userInput != null) { // If there is a user input, check to see if the input exists
    value = getSpecificValueFromSheet(sheet, userInput); //if the value exists, generate an object from it
    
    if (typeof value === "undefined") {  // if the value does not exist, add teh value to the sheet and make an object from it
      value = addNewValueToSheet(sheet, userInput)
    }  
    
  } else {
      value = getRandomValueFromSheet(sheet); // just get any random value from the sheet
  }
  
  // Add the value to the story object
  story[sheetName].push(value);
  Logger.log(JSON.stringify(story));
  
  // while addedStuff.length < neededStuff, get some stuff
  // get a new name that is not yet added into story.people array
    // get list of ids taht are current in story.people (something like currentPeople = story.people.map(person => person.id) )
    // while (story.people.length < unqiue), //check numbes of name in the people array vs. how many we need
      //get randomId name/row. 
      // if (currentPeople.indexOf(randomId) === -1)
        // create newPerson object
        // story.people.push(newPersonObject)
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
  Logger.log("matches with values: " + matchingArray);
  
  // Get the one matching array  the filtered data.
  let matchingValue = matchingArray[0];
  let coreObject = newCore(matchingValue[0],matchingValue[1]);
  
  Logger.log("Got value: " + JSON.stringify(coreObject));
  
  return coreObject;
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
  Logger.log("Inserted the value '" + value + "'.");
  
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
  Logger.log("Got values: " + values);
  
  // Select single value from data
  let index = Math.floor(Math.random() * numRows);
  Logger.log("Got random index '" + index + "'");
  
  // .getValues is a little funky, returns a 2D array. 
  // Must specify desired row and column, even if only one column.
  let value = values[index];
  
  let coreObject = newCore(value[0], value[1]);
  Logger.log("Got random object: '" + JSON.stringify(coreObject) + "'" );
  
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

function getUniqueXVariableArray(rawMessage = null, xVariableRegex  = null) {
  
  let xVariableName = /xName[1-9]{1,2}/g;
  let xVariableFood = /xFood[1-9]{1,2}/g;
  let xVariableJob = /xJob[1-9]{1,2}/g;
  let xVariableAdj = /xAdj[1-9]{1,2}/g;
 
  // TODO: Remove when this goes live
  rawMessage = "This is a story about xName1. xName1 is good at xJob1. xName1 can dunk.. xName2 once ate a xFood1 on the court.. xName3 is the first test in a long story";
  let matchArray = rawMessage.match(xVariableFood);
  Logger.log(matchArray);
  
  let uniques = [];
    
  for (let i of matchArray) {
    if (uniques.indexOf(i) === -1) {
      uniques.push(i)
      Logger.log("Added '" + i + "' to uniques.");
    }
  }
  Logger.log("Uniques: " + uniques);
};


/*
*

Update the raw message to include the names for the variables.

@param uniqueXVariables {array} array of the unique xVariables in rawMessage
@param replacementValues {array} array of the values of that will replace each xVariable
@param compiledMessage {string} the story.message.compiled of the compiled phrases.
@return updatedMessage {string} basicall raw message with xName[1-9] replaced with story.people[x].name

*
*/

function updateCompiledMessage(uniqueXVariables, replacementValues, compiledMessage) {
  
  // for (let i in uniqueXVariables) {
    // compiledMessage.replace(uniqueXVariables[i], replacementValues[i])
  // }
  // return compiledMessage;
}