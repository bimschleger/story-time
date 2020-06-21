/*
*

Get all of the person objects that we need for the story.

@param story {object} our core story object
@param sheetName {string} the name of the sheet form which we want to read.
@param userInput {string} A name that the user optionally provides.
@return peopleArray {array} array of person objects, with one object for each person that is in the story. 

*
*/

function getCoreObject(userInput = "Pluto") { //add in (story, sheetName, userInput)
  
  let sheetName = "names";
  let story = {
    "date": null,
    "names": [],
    "jobs": [],
    "foods": [],
    "phrases": [],
    "adjectives": [],
    "message": {
      "raw": null,
      "compiled": null
    },
    "rating": null
  };
  
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
  
  
  // Add the vlaue to the story object
  story[sheetName].push(value);
  
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
  Logger.log("Got value: " + matchingValue);
  
  return matchingValue;
}


/*
*

Get an array of the unique xVariables in use within story.message.raw

@param rawMessage {string} story.message.raw
@param xVariableRegex {string} regex value
@return uniqueXVariables {array} array of unique xVariables fir a specifuc type (e.g. person)

*
*/

function getUniqueXVariableArray(rawMessage, xVariableRegex) {
  
  // determine how many objects we need
  // xVariableRegex in format '\xName[1-9]{1}\'
  // get array ('allXVariables') = rawMessage.match(xVariable)
  // get array ('uniqueXVariables') of unqiue values for 'allVariables'. 
    // maybe use .indexOf to determine if the value exists in the new array
  
  //return uniqueXVariables
} 

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