/*

Gets all sequential story phrases based on the leadsTo field in 'phrases'

@return phrases {array} array of phrase objects that work sequentially together

*/

function getStoryPhrases() {
  
  // TODO: remove sample story
  // TODO: update parameter to be story
  // TODO: add getStoryPhrases() into doGet() and doPost()
  
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
  
  // Set up spreadsheet access
  let spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1vtmWWWKqrJm7NtScJPuj-iCld9i3ls3SsCfQDJpPcfY/edit?usp=sharing';
  let ss = SpreadsheetApp.openByUrl(spreadsheetUrl);
  let sheetName = "phrases";
  let sheet = ss.getSheetByName(sheetName);
  
  // Setup range to pull
  let firstRow = 2;
  let lastRow = sheet.getLastRow() ;
  let numRows = lastRow -1;
  let firstColumn = 1;
  var numColumns = 4;
  
  // Set up variables for the while loop
  let allPhrases = sheet.getRange(firstRow, firstColumn, numRows, numColumns).getValues();    // Get range of all phrases
  let finalPhrase = false;    // Use this to end the while loop if the leadsTo for a phrase is null.
  let loopCounter = 0;                  // Use this to get starter sentences in the while loop.
  var phrase;
  
  // Loop to collect all phrases
  while (finalPhrase === false) {
    
    if (i === 0) {    // Get the initial phrase, with the 'starter' value of 1
      
      let starterPhrases = allPhrases.filter((row) => row[2] === 1);
      let index = Math.floor(Math.random()*(starterPhrases.length - 1));
      
      phrase = starterPhrases[index];
      Logger.log("Got a starter phrase: '" + phrase[1] + "'");
      loopCounter += 1;
      
    } 
    
    else {    // Get any non-starter phrase
      
      let index = Math.floor(Math.random()*(recentPhrase.leadsTo.length - 1));    // Gets the phrase ids for phrases that follow the previous phrase
      let phraseId = recentPhrase.leadsTo[index];
      Logger.log("Got phrase id: " + phraseId);

      // All phrases are in a big 2D array.
      // When I filter, the system returns an array that contains the only array that meets the criteria
      // [[my array]]
      phrase = allPhrases.filter((row) => row[0] === phraseId);
      phrase = phrase[0];
      
    }
    
    // Add the most recent phrase to the story object
    var recentPhrase = newPhrase(phrase);
    
    // Add new phrase to story object
    story.phrases.push(recentPhrase);
    Logger.log("Added to the story object the phrase: '" + recentPhrase.phrase + "'");

    // Break the loop if the most recent phrase does not have values for leadsTo
    if (recentPhrase.leadsTo === null) {
      
      Logger.log("Broke the loop");
      finalPhrase = true;
      
    } 
    loopCounter += 1;
    
  }
  
  // Test to compile all the phrases in a log
  story.phrases.forEach(function (phrase) {
    Logger.log(phrase.phrase);
  });
}


/*

Converts the leadsTo string into an array of integers

@param leadsToString {string} a string of comma-separated ids
@return leadsTo {array} an array of integer ids

*/

function convertLeadsToStringToArray(leadsToString) {
  
  var leadsTo;
  
  // If the phrase does not have a vlaue in the leadsToString, leadsTo as null
  // Final phrases not not have values in leadsTo column
  if (leadsToString.length > 0) {
    
    let leadsToValues = leadsToString.split(",");
    leadsTo = leadsToValues.map(function (value, index, array) {
      return parseInt(value); 
    });
    
  }
  else {
    // If there is no destination for the phrase, mark it as null.
    leadsTo = null;
  }
  
  return leadsTo; 
}