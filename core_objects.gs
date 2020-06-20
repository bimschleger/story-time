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

@return phrase {object} Contains id, phrase, starter, and leadsTo for a specific prhase

*/

function newPhrase() {
  
  let phrase = {
    "id": null,
    "phrase": null,
    "starter": null,
    "leadsTo": []
  }
  
  return phrase;
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