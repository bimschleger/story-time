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
  
//  // Get starter phrase
//  let starterPhrase = getStarterPhrase(allPhrases);
//  story.phrases.push(starterPhrase);
//  Logger.log("Added '" + starterPhrase.phrase + "' to the overall list");

  let finalPhrase = false;
  let i = 0;
  
  // Loop to collect all phrases
  while (finalPhrase === false) {
    
    if (i === 0) {
      
      // Get the initial phrase, with the starter value of 1
      let starterPhrases = allPhrases.filter((row) => row[2] === 1);
      let index = Math.floor(Math.random()*(starterPhrases.length - 1));
      var phrase = starterPhrases[index];
      Logger.log("Got a starter phrase: '" + phrase[1] + "'");
      finalPhrase = true;
      
    } 
    else {
    
      // Get any non-starter phrase
      let lastPhraseLeadsTo = story.phrases[story.phrases.length - 1].leadsTo;
      let index = Math.floor(Math.random()*(lastPhraseLeadsTo.length - 1));
      let phraseId = lastPhraseLeadsTo[index];
      var phrase = allPhrases.filter((row) => row[0] === phraseId);
      Logger.log("Got a non-starter phrase: '" + phrase[1] + "'");
      
      
    }
    
    // Add the most recent phrase to the story object
    let phraseToAdd = newPhrase(phrase);
    story.phrases.push(phraseToAdd);
    Logger.log("Added to the story object the phrase: '" + phraseToAdd.phrase + "'");

    // Break the loop if the most recent phrase does not have values for leadsTo
    if (phraseToAdd.leadsTo === []) {
       Logger.log("Broke the loop");
      finalPhrase = true;
    }
    i += 1;
    
  }
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