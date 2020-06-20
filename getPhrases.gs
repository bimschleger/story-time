/*

Gets all sequential story phrases based on the leadsTo field in 'phrases'

@return phrases {array} array of phrase objects that work sequentially together

*/

function getStoryPhrases(story) {
  
  // let phraseStarterIds = getStarterIds();
  // let phraseStarter = getRandomPhrase(phraseStarterIds);
  // story.phrases.push(phraseStarter)
  //nextPhraseId = 
  //while story.phrases[story.phrases.length - 1] != []latest_phrase.leadsTo != []
  
}


/* 

Gets all of the phrases that can kickoff the sequences

@return starterIds {array} array of all of the ids of phrases that kickoff the sequence.

*/

function getStarterId() {
  
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
  
  let starterPhrases = allPhrases.filter((row) => row[2] === 1);
  
  Logger.log("Filtered phrasese are: " + starterPhrases);
  
  // Get the id from each starter phrase
  let index = Math.floor(Math.random()*(starterPhrases.length - 1));
  let id = starterPhrases[index][0];
  
  Logger.log("starter id is: " + id);
  
  
  //return filteredPhrases;
  
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