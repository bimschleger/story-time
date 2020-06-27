/*

Immediately returns a story with variables from the spreadsheet.

@return storyObject {object} 

*/

function doGet() {
  
  let story = buildStory();

  return ContentService.createTextOutput(JSON.stringify(story)).setMimeType(ContentService.MimeType.JSON);   
}


/*

Accept the custom inputs from the user, return them in a story

@param e {object} event containing incoming parameters
@return storyObject {object} Contains the concatenated message sent to the user

*/

function doPost(e) {
  
  // TODO: Something is not working quite right. Not getting back a response.
  let inboundJson = JSON.parse(e.postData.parameter);
  Logger.Log("received inbound JSON: " + JSON.stringify(inboundJson));
  
  let story = buildStory(inboundJson);
  
//  let response = newStory();
//  response.message.compiled = "We're not quite ready for you to tell a story. Stay tuned!";
  
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
  
  // Build the phrases and get the xVariables from the story.message.raw
  var story = getStoryPhrases();
  let xVariables = getUniqueXVariables(story.message.raw);
  let sheetNames = Object.keys(xVariables);
  
  // Checks if the user inputs exists or not, and adds the objects to the story
  if (userInputs != null) {
    Logger.log("\nUser inputs exist!\n");
    Object.keys(userInputs).forEach(function(userSheet) {
      Logger.log("Processing user input value '" + userInputs[userSheet] + "' for sheet '" + userSheet + "'.");
      story = getCoreObject(story,userSheet,userInputs[userSheet]);
    });
  }
  
  // Adds any additional name, food, or job objects that the story requires.
  for (let sheet of sheetNames) {
    while (story[sheet].length < xVariables[sheet].uniques.length) {
      story = getCoreObject(story, sheet);;
    }
  }
  
  // Replaces xVariables in story.message.raw with the true variables.
  story.message.compiled = replaceXVariablesWithValues(story, xVariables);
  Logger.log("Here is the final story: " + JSON.stringify(story));
  
  return story;
}


/*

Replaces xVariables with the random or user-input variables.

@param story {object} our main story object that contains the raw story, compiled story, and all true values.
@param xVariables {object} contains the unique values that we will replace
@return compiledStory {string} the final compiled story.

*/

function replaceXVariablesWithValues(story, xVariables) {
  
  var compiledStory = story.message.raw;
  let xVariableKeys = Object.keys(xVariables);
  
  // Loop through each unique xVariable and replace it with the corresponding random value.
  xVariableKeys.forEach(function (key) {
    var count = 0;
    for (let i of xVariables[key].uniques) {
      
      let xVar = xVariables[key].uniques[count];
      let value = story[key][count].name;
      let regex = new RegExp(xVar,"g"); // a regex workaround, since .replaceAll does not exist and i need to use /stuff/g (g) to replace all vlaues.
      
      compiledStory = compiledStory.replace(regex, value);
      Logger.log("Replaced '" + xVar + "' with '" + value + "'.");
      count += 1;
    }
    
  });
  Logger.log("Here is the final compiled story: '" + compiledStory + "'.");
  return compiledStory;
}

/*

TODOs

- Remove distinct URL to spreadsheet, and move into Properties for security reasons
- Email notification to me when new user submitteed content is added. use standard GmailApp class
- Text to speech to share the audio file of the story. use something like https://aws.amazon.com/polly/ to handle TTS
- More complex story branching
- Log each unique execution: datetime, get/post, read/listen/write, name, job, food, phrase1, phrase2, phrase3
- when generating multiple random values, don't let the system pick the same value twice.

*/