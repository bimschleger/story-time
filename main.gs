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

Build the core story object and fill all of the data.

@param userInputs {object} whatever ther user posted into the system. Likely a name, job, food, and adjective.
@return ??

*/

function buildStory(userInputs = null) {
  
  let story = getStoryPhrases();
  let xVariables = getUniqueXVariables(story.message.raw);
  let sheetNames = Object.keys(xVariables);
  
  for (let sheet of sheetNames) {
    let count = 0;
    
    while (count < xVariables[sheet].uniques.length) {
      story = getCoreObject(story, sheet);
      count += 1;
    }
  }
  
  // Add in regex replace function here
  Logger.log("Here is the final compiled story: " + JSON.stringify(story));
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