/*
*

Creates the blank story object for use in both doGet and doPost.

@return story {object} an object containing null values for each of the required story keys.

*
*/

function newStory() {
  
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
  
  return story;
}


/*
*

New object for a phrase

@param phraseArray {array} array of [1,"This is a story about XNAME1",1,"5,6,7,8,9,10"]
@return phrase {object} Contains id, phrase, starter, and leadsTo for a specific prhase

*
*/

function newPhrase(phraseArray) {
  
  // Map the array variables
  let id = phraseArray[0];
  let phrase = phraseArray[1];
  let starter = phraseArray[2];
  let leadsTo = convertLeadsToStringToArray(phraseArray[3]);
  
  // Define my phraseObject
  let phraseObject = {
    "id": id,
    "phrase": phrase,
    "starter": starter,
    "leadsTo": leadsTo
  }
  
  return phraseObject;
}


/*
*

Converts the leadsTo string into an array of integers

@param leadsToString {string} a string of comma-separated ids
@return leadsTo {array} an array of integer ids

*
*/

function convertLeadsToStringToArray(leadsToString) {
  
  var leadsTo;
  
  // If the phrase does not have a vlaue in the leadsToString, leadsTo as null
  // Final phrases not not have values in leadsTo column
  
  // todo: be able to handle integers forsingle value leadsTo
  
  if (leadsToString.length > 0) {
    if (typeof leadsToString === "number") {
      leadsTo = [leadsToString];
    } 
    else {
      let leadsToValues = leadsToString.split(",");
      leadsTo = leadsToValues.map(function (value, index, array) {
        return parseInt(value); 
      });
    }
  }
  else {
    // If there is no destination for the phrase, mark it as null.
    leadsTo = null;
  }
  
  return leadsTo; 
}
  
  
/*
*

Creates empty core object. Core includes names, foods, jobs, and adjectives.

@return name {object} an object containing null values for each of the required name keys.

*
*/

function newCore(id, name) {
  
  let core = {
    "id": id,
    "name": name
  };
    
  return core;
}