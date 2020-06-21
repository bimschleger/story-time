/*

Immediately returns a story with variables from the spreadsheet.

@return storyObject {object} 

*/

function doGet() {
  
  // Create story object
  let emptyStory = newStory();
  Logger.log("Created an empty story object");
  
  // Add values for each key with a null value
  let story = setNullStory(emptyStory);
  Logger.log(story);
  
  // Compile story into one string
  story.message = compileStory(story);
  Logger.log("message: " + story.message)

  return ContentService.createTextOutput(JSON.stringify(story)).setMimeType(ContentService.MimeType.JSON);   
}


/*

Accept the custom inputs from the user, return them in a story

@param e {object} event containing incoming parameters
@return storyObject {object} Contains the concatenated message sent to the user

*/

function doPost(e) {
  
  Logger.log("Post received");
  
  // Create empty story object
  let emptyStory = newStory();
  
  // Get POST values
  let request = JSON.parse(e.postData.contents);
  Logger.log("Post contents: " + JSON.stringify(request));
  
  // Add user inputs to the spreadsheet
  addUserInputsToSheet(request);
  
  // Merge user request into emptystory
  let story = Object.assign(emptyStory, request);
  
  // Determine values for each key with a null value
  story = setNullStory(story)
  Logger.log("All keys have non-null values.");
  
  // Compile story into one string
  story.message = compileStory(story);
  Logger.log("Message: " + story.message);
  
  return ContentService.createTextOutput(JSON.stringify(story)).setMimeType(ContentService.MimeType.JSON);    
}


/*

Creates the blank story object for use in both doGet and doPost.

@return story {object} an object containing null values for each of the required story keys.

*/

function newStory() {
  
  let story = {
    "date": null,
    "names": [],
    "jobs": [],
    "foods": [],
    "phrases": [],
    "adjectives": [],
    "message": null,
    "rating": null
  };
  
  return story;
}

/*

Finds all null fields, and sets the random value to them.

@param story {object} Usually a story object with several null keys.
@return story {object} The same object returned with a value for each key

*/

function setNullStory(story) {
  
  // Get a random value for each key that is null
  for (let [key, value] of Object.entries(story)) {
    if (value === null) {
      let randomValue = getRandomValueFromSheet(key);
      story[key] = randomValue;
      Logger.log("Set key (" + key + ") to " + randomValue);
    }
  };
  
  return story;
}


/* Gets one value the variable on a particular sheet

@param sheetName {string} The name of the spradsheet that we want to grab data from.
@return value {string} The random value from the specified sheet that we'll use for the story

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
  sheet.getrange
  Logger.log("Got values: " + values);
  
  // Select single value from data
  let index = Math.floor(Math.random() * numRows);
  Logger.log("Got random index");
  
  // .getValues is a little funky, returns a 2D array. 
  // Must specify desired row and column, even if only one column.
  let value = values[index][1];
  Logger.log("Got '" + value + "' value" );
  
  return value;
}


/*

Takes parts of a story and concatenates them into asingle string.

@param story {object} Collection of variables and phrases that comprise the story
@return storyObject {object} Concatenated story

*/

function compileStory(story) {
  let phrase1 = story.phrase1;
  let name1 = story.name1;
  let phrase2 = story.phrase2;
  let job1 = story.job1;
  let phrase3 = story.phrase3;
  let food1 = story.food1;
  
  let message1 = phrase1 + name1 + ". ";
  let message2 = name1 + " " + phrase2 + " " + job1 + ". ";
  let message3 = name1 + " " + phrase3 + " " + food1;
  let messageTotal = message1 + message2 + message3;
  Logger.log("Compiled message: "+ messageTotal);
  
  let storyObject = {
    story: messageTotal
  }
  
  return storyObject;
}


/*

Send an email notification whenever new content is added to the spreadsheet.

*/

function sendEmailNotification(story, message) {
  
  
  
  let recipient = "brian@bimschleger.com";
  
  let subject = "New story time: ";
}


/* 

Add user-submitted words to the spreadsheet.

@param request {object} the JSON object of the user customized inputs from the Shortcuts app

*/

function addUserInputsToSheet(request) {
  
  // For each key/value pair in the requests object, add the value to the sheet
  for (let [sheetName, value] of Object.entries(request)) {
    addSingleValueToSheet(sheetName, value);
  };
  
  Logger.log("Added all values to the spreadsheet.");
 
  
}


/* 

Add a single value to a particular spreadsheet.

@param sheetName {string} Name of the sheet to which the system writes the value
@param value {string} Value that the system will append to the last row of the specified sheet

*/

function addSingleValueToSheet(sheetObject, value) {
  
  let lastRow = sheetObject.getLastRow();
  let insertRow = lastRow + 1;
  let insertColumn = 1;
  
  // Add the value to the appropriate sheet
  sheetObject.getRange(insertRow, insertColumn).setValue(value);
  
  let coreObject = newCore();
  coreObject.id = lastRow;
  coreObject.name = value;
  
  Logger.log("Inserted the value " + value + "'");
  
  return coreObject;
  
}


/* 

Connect to a specific spreadsheet.

@param sheetName {string} the name of the sheet to connect to
@return {object} returns the sheet object with all the data

*/

function getSheetData(sheetName) {
  
  let spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1vtmWWWKqrJm7NtScJPuj-iCld9i3ls3SsCfQDJpPcfY/edit?usp=sharing';
  let ss = SpreadsheetApp.openByUrl(spreadsheetUrl);
  let sheet = ss.getSheetByName(sheetName);
  Logger.log("Got sheet (" + sheetName + ")");
  
  return sheet;
}

/*

TODOs

- Remove distinct URL to spreadsheet, and move into Properties for security reasons
- Add user-submitted inputs to the correct sheet in sheets. find last now, add value to lastrow+1
- Email notification to me when new user submitteed content is added. use standard GmailApp class
- Text to speech to share the audio file of the story. use something like https://aws.amazon.com/polly/ to handle TTS
- More complex story branching
- Log each unique execution: datetime, get/post, read/listen/write, name, job, food, phrase1, phrase2, phrase3

*/