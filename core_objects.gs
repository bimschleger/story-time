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

New object for a phrase

@param phraseArray {array} array of [1,"This is a story about XNAME1",1,"5,6,7,8,9,10"]
@return phrase {object} Contains id, phrase, starter, and leadsTo for a specific prhase

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

Creates empty core object

@return name {object} an object containing null values for each of the required name keys.

*/

function newCore() {
  
  let core = {
    "id": null,
    "name": null
  };
    
  return core;
}


/*

Creates empty name object

@return name {object} an object containing null values for each of the required name keys.

*/

function newFood() {
  
  let food = newCore();
    
  return food;
  
}

  
/*

Creates empty job object

@return job {object} an object containing null values for each of the required job keys.

*/

function newJob() {
  
  let job = newCore();
    
  return job;
}

  
/*

Creates empty adjective object

@return adjective {object} an object containing null values for each of the required adjective keys.

*/

function newAdjective() {
  
  let adjective = newCore();
    
  return adjective;
}