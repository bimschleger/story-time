/*

Immediately returns a story with variables from the spreadsheet.

@return storyObject {object} 

*/

function doGet() {
  
  // Create storyparts object
  let emptyStoryParts = createEmptyStoryParts();
  Logger.log("Created emptyStoryParts object");
  
  // Add values for each key with a null value
  let storyParts = setNullStoryParts(emptyStoryParts);
  Logger.log(storyParts);
  
  // Compile story into one string
  let storyObject = compileStory(storyParts);
  Logger.log("message: " + storyObject.story)

  return ContentService.createTextOutput(JSON.stringify(storyObject)).setMimeType(ContentService.MimeType.JSON);   
}


/*

Accept the custom inputs from the user, return them in a story

@param e {object} event containing incoming parameters
@return storyObject {object} Contains the concatenated message sent to the user

*/

function doPost(e) {
  
  Logger.log("Post received");
  
  // Create empty storyParts object
  let emptyStoryParts = createEmptyStoryParts();
  
  // Get POST values
  let request = JSON.parse(e.postData.contents);
  Logger.log("Post contents: " + JSON.stringify(request));
  
  // Merge user request into emptyStoryParts
  let storyParts = Object.assign(emptyStoryParts, request);
  
  // Determine values for each key with a null value
  storyParts = setNullStoryParts(storyParts)
  Logger.log("All keys have non-null values.");
  
  // Compile story into one string
  let storyObject = compileStory(storyParts);
  Logger.log("Message: " + storyObject.story);
  
  return ContentService.createTextOutput(JSON.stringify(storyObject)).setMimeType(ContentService.MimeType.JSON);    
}


/*

Creates the blank story object for use in both doGet and doPost.

@return storyParts {object} an object containing null values for each of the required story keys.

*/

function createEmptyStoryParts() {
  
  let storyParts = {
    "name1": null,
    "job1": null,
    "food1": null,
    "phrase1": null,
    "phrase2": null,
    "phrase3": null
  };
  
  return storyParts;
}


/*

Finds all null fields, and sets the random value to them.

@param storyParts {object} Usually a storyParts object with several null keys.
@return storyParts {object} The same object returned with a value for each key

*/

function setNullStoryParts(storyParts) {
  
  // Get a random value for each key that is null
  for (let [key, value] of Object.entries(storyParts)) {
    if (value === null) {
      let randomValue = getRandomValueFromSheet(key);
      storyParts[key] = randomValue;
      Logger.log("Set key (" + key + ") to " + randomValue);
    }
  };
  
  return storyParts;
}


/* Gets one value the variable on a particular sheet

@param sheetName {string} The name of the spradsheet that we want to grab data from.
@return value {string} The random value from the specified sheet that we'll use for the story

*/

function getRandomValueFromSheet(sheetName) {
  
  let spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1vtmWWWKqrJm7NtScJPuj-iCld9i3ls3SsCfQDJpPcfY/edit?usp=sharing';
  let ss = SpreadsheetApp.openByUrl(spreadsheetUrl);
  
  // Access specific spreadsheet by name
  let sheet = ss.getSheetByName(sheetName);
  Logger.log("Got sheet (" + sheetName + ")");
  
  // Prepare variables necessary for getting values
  let rowsMax = sheet.getLastRow();
  let rowsData = rowsMax -1;
  let startingRow = 2;
  let startingColumn = 1;
  
  // Get value from the sheet
  let values = sheet.getRange(startingRow, startingColumn, rowsData).getValues();
  
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
  Logger.log("Compiled message: "+ messageTotal);
  
  let storyObject = {
    story: messageTotal
  }
  
  return storyObject;
}

/*

TODOs

- Add user-submitted inputs to the correct sheet in sheets. find last now, add value to lastrow+1
- Email notification to me when new user submitteed content is added. use standard GmailApp class
- Text to speech to share the audio file of the story. use something like https://aws.amazon.com/polly/ to handle TTS
- More complex story branching
- Log each unique execution: datetime, get/post, read/listen/write, name, job, food, phrase1, phrase2, phrase3

*/