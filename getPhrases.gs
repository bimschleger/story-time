/*
*

Gets all sequential story phrases based on the leadsTo field in 'phrases'

@return phrases {array} array of phrase objects that work sequentially together

*
*/

function getStoryPhrases() {
  
  // TODO: remove sample story
  // TODO: update parameter to be story
  // TODO: add getStoryPhrases() into doGet() and doPost()
  
  let sheetName = "phrases";
  let story = newStory();
  let sheet = getSheetData(sheetName);
  
  // Setup range to pull
  let firstRow = 2;
  let lastRow = sheet.getLastRow() ;
  let numRows = lastRow -1;
  let firstColumn = 1;
  var numColumns = 4;
  
  // Set up variables for the while loop
  let allPhrases = sheet.getRange(firstRow, firstColumn, numRows, numColumns).getValues();    // Get range of all phrases
  let finalPhrase = false;              // Use this to end the while loop if the leadsTo for a phrase is null.
  let loopCounter = 0;                  // Use this to get starter sentences in the while loop.
  var phrase;
  
  // Loop to collect all phrases
  while (finalPhrase === false) {
    
    if (loopCounter === 0) {    // Get the initial phrase, with the 'starter' value of 1
      
      let starterPhrases = allPhrases.filter((row) => row[2] === 1);
      let index = Math.floor(Math.random()*(starterPhrases.length - 1));
      
      phrase = starterPhrases[index];
      let phraseId = phrase[0];
      let phraseSentence = phrase[1];
      
      Logger.log("Got random phrase id: '" + phraseId + "' and phrase '" + phraseSentence + "'.");
      loopCounter += 1;
      
    } 
    
    else {    // Get any non-starter phrase
      
      let index = Math.floor(Math.random()*(recentPhrase.leadsTo.length - 1));    // Gets the phrase ids for phrases that follow the previous phrase
      let phraseId = recentPhrase.leadsTo[index];

      // All phrases are in a big 2D array.
      // When I filter, the system returns an array that contains the only array that meets the criteria
      // [[my array]]
      phrase = allPhrases.filter((row) => row[0] === phraseId);
      phrase = phrase[0];
      Logger.log("Got random phrase id: '" + phraseId + "' and phrase '" + phrase + "'.");
    }
    
    // Add the most recent phrase to the story object
    var recentPhrase = newPhrase(phrase);
    
    // Add new phrase to story object
    story.phrases.push(recentPhrase);
    Logger.log("Added the phrase: '" + recentPhrase.phrase + "'  to the 'story' object.");

    // Break the loop if the most recent phrase does not have values for leadsTo
    if (recentPhrase.leadsTo === null) {
      
      Logger.log("Collected all phrases.");
      finalPhrase = true;
      
    } 
    loopCounter += 1;
  }
  Logger.log("Updated story object: '" + JSON.stringify(story) + "'");
  
  // Compile all phrases into raw mwssage.
  story.message.raw = compileRawMessage(story.phrases);
  
  // Create the compiled message that will get regex'd later on
  story.message.compiled = story.message.raw;
  
  return story;
  
}


/* 
 *
 Compile the story from all the phrases into one raw string.

 @param phrases {array} an array of phrase objects.
 @return message_raw {string} Since string that joins all the phrases together.

 *
 */

function compileRawMessage(phrases) {
  
  let rawPhrases = phrases.map(phraseObject => phraseObject.phrase);
  
  let rawMessage = rawPhrases.join(". ");
  Logger.log("Generated raw message: '" + rawMessage + "'.");
  
  return rawMessage;
}