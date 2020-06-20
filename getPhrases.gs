/*

Gets all sequential story phrases based on the leadsTo field in 'phrases'

@return phrases {array} array of phrase objects that work sequentially together

*/

function getStoryPhrases() {
  
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
  
  // Access specific spreadsheet by name
  let sheet = ss.getSheetByName(sheetName);
  Logger.log("Got sheet (" + sheetName + ")");
  
  // Setup range to pull
  let firstRow = 2;
  let lastRow = sheet.getLastRow() ;
  let numRows = lastRow -1;
  let firstColumn = 1;
  var numColumns = 4;
  
  // Get range of all phrases
  let allPhrases = sheet.getRange(firstRow, firstColumn, numRows, numColumns).getValues();
  Logger.log("Got all the phrases");

  let finalPhrase = false;
  let i = 0;
  var phrase;
  
  // Loop to collect all phrases
  while (finalPhrase === false) {
    
    // Get the initial phrase, with the starter value of 1
    if (i === 0) {
        
      let starterPhrases = allPhrases.filter((row) => row[2] === 1);
      let index = Math.floor(Math.random()*(starterPhrases.length - 1));
      phrase = starterPhrases[index];
      
      Logger.log("Got a starter phrase: '" + phrase[1] + "'");
      i += 1;
      
    } 
    // Get any non-starter phrase
    else {
      
      
      let lastPhraseLeadsTo = story.phrases[story.phrases.length - 1].leadsTo;
      Logger.log(lastPhraseLeadsTo);
      Logger.log("^^^Got leadsTo values");
      
      let index = Math.floor(Math.random()*(lastPhraseLeadsTo.length - 1));
      let phraseId = lastPhraseLeadsTo[index];
      Logger.log("Got phrase id: " + phraseId);

      // All phrases are in a big 2D array.
      // When I filter, the system returns an array that contains the only array that meets the criteria
      // [[my array]]
      phrase = allPhrases.filter((row) => row[0] === phraseId);
      phrase = phrase[0];
      
    }
    
    // Add the most recent phrase to the story object
    let phraseToAdd = newPhrase(phrase);
    
    // Add new phrase to story object
    story.phrases.push(phraseToAdd);
    Logger.log("Added to the story object the phrase: '" + phraseToAdd.phrase + "'");

    // Break the loop if the most recent phrase does not have values for leadsTo
    if (phraseToAdd.leadsTo === null) {
      Logger.log("Broke the loop");
      finalPhrase = true;
    }
    i += 1;
    
  }
  
  // Test to compile all the phrases in a log
  story.phrases.forEach(function (phrase) {
    Logger.log(phrase.phrase);
  });
}


/* 

Gets all of the phrases that can kickoff the sequences

@param allPhrases {array} two dimensional array of all phrases and their parts
@return starterIds {array} array of all of the ids of phrases that kickoff the sequence.

*/

function getStarterPhrase(allPhrases) {
  
  let starterPhrases = allPhrases.filter((row) => row[2] === 1);
  
  // Get a random index to grab a phrase array.
  let index = Math.floor(Math.random()*(starterPhrases.length - 1));
  let starterPhraseObject = newPhrase(starterPhrases[index]);
  
  return starterPhraseObject;
  
}


/* 

Determines the id of the next phrase that the system should get.

@param ids {array} list of digits, likely in string format, that determine the possible next phrases
@return nextPhraseId {integer} The id of the next phrase for the system to get

*/

function getRandomPhrase(ids) {
  
  // get the array (ids)
  // map a new array (idsInts)of parseInt() in the above array.
  // let idsInts = ids.map(parseInt(x)) ... or something like that
  // get a random int (x) between 0 and (length of array -1)
  // get the integer (nextPhaseId) at index(x)
  // return nextPhaseId
  
}