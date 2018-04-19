function getCurrentTimePlayingInAudio(){
  return document.querySelector('audio').currentTime;
}

function displayAllWordButtons(){
  if(document.querySelector('#wordButtons').style.display === 'block'){
    document.querySelector('#wordButtons').style.display = 'none';
  }else{
    document.querySelector('#wordButtons').style.display = 'block';
  }
}

// NEED TO START AS null TO CLEAR INTERVAL IN FUTURE
var singleWordInterval = null;
// To play two next to each other: playChunkOfAudio(5,10,1,0, function(){playChunkOfAudio(15,20)})

function playChunkOfAudio(beginning,end,playbackRate,orderInAudioLink,callback){
  clearInterval(singleWordInterval);
  document.querySelector('audio').currentTime = beginning;

  if (orderInAudioLink || orderInAudioLink === 0) {
    document.querySelector('#audioLinkWord-'+orderInAudioLink).style.fontWeight ='bold';
  }
  if(playbackRate){
    document.querySelector('audio').playbackRate = playbackRate;
  }
  document.querySelector('audio').play();

  singleWordInterval = setInterval(function(){
    if(end < document.querySelector('audio').currentTime){
      if (orderInAudioLink || orderInAudioLink === 0) {
        document.querySelector('#audioLinkWord-'+orderInAudioLink).style.fontWeight ='normal';
      }
      document.querySelector('audio').pause();
      // RESET PLAYBACK RATE TO NORMAL
      document.querySelector('audio').playbackRate = 1;
      clearInterval(singleWordInterval);
      if(callback){
        callback();
      }
    }
  },0.1);
}


// ------------------------------------------------------------------------------
audioLinkArrayObjects = [];

function createStringForAudioLinkEval(beginning,end, playbackRate,orderInAudioLink){
  if (playbackRate) {
    var playback = ','+ playbackRate;
  }else{
    var playback = '';
  }
  if (orderInAudioLink || orderInAudioLink === 0) {
    var orderInAudioLink = ','+ orderInAudioLink;
  }else{
    var orderInAudioLink = '';
  }


  stringToAdd = 'playChunkOfAudio('+beginning+','+end + playback + orderInAudioLink + ',function(){console.log("FINISHED")})';

  return stringToAdd;
}

function audioLinkObject(beginning, end, playbackRate, stringFunction,string) {
    this.objectNumber = audioLinkArrayObjects.length;
    this.beginning = beginning;
    this.end = end;
    this.playbackRate = playbackRate;
    this.stringFunction = stringFunction;
    this.string = string;
    this.updateStringFunction = function() {this.stringFunction = createStringForAudioLinkEval(this.beginning,this.end, this.playbackRate,this.objectNumber);linkAudioLinkArray();this.setHtml();};
    this.increasePlaybackRate = function() {this.playbackRate = this.playbackRate  += .1;this.updateStringFunction();};
    this.decreasePlaybackRate = function() {this.playbackRate = this.playbackRate  -= .1;this.updateStringFunction();};
    this.setPlaybackRate = function(playbackRate) {this.playbackRate = playbackRate;this.updateStringFunction();};
    this.increaseTime = function() {this.end = this.end  += .01;this.updateStringFunction();};
    this.decreaseTime = function() {this.end = this.end  -= .01;this.updateStringFunction();};
    this.setEnd = function(end) {this.end = end;};
    this.increaseTimeBeginning = function() {this.beginning = this.beginning  += .01;this.updateStringFunction();};
    this.decreaseTimeBeginning = function() {this.beginning = this.beginning  -= .01;this.updateStringFunction();};
    this.setBeginning = function(beginning) {this.beginning = beginning;this.updateStringFunction();};
    this.html = '<span id="audioLinkWord-'+this.objectNumber+'" class="tooltip" style="cursor:pointer;">' + '<span style="margin-right: 5px;" onclick='+this.stringFunction+'>' + this.string + '</span>' + '<span class="tooltiptext" style="width:200px;"> <span>'+this.string+'</span> <br> <span>'+this.beginning+'-'+this.end+'</span> <br> <span>Playback Rate:'+this.playbackRate+'</span> <hr> <button onclick="audioLinkArrayObjects['+this.objectNumber+'].decreasePlaybackRate()"> - Playback  </button> <button onclick="audioLinkArrayObjects['+this.objectNumber+'].increasePlaybackRate()"> + Playback  </button> <button onclick="audioLinkArrayObjects['+this.objectNumber+'].decreaseTime()"> - EndTime  </button> <button onclick="audioLinkArrayObjects['+this.objectNumber+'].increaseTime()"> + EndTime  </button> <button onclick="audioLinkArrayObjects['+this.objectNumber+'].decreaseTimeBeginning()"> - begTime  </button> <button onclick="audioLinkArrayObjects['+this.objectNumber+'].increaseTimeBeginning()"> + begTime  </button> </span> </span>';
    this.setHtml = function(){
      this.html = '<span id="audioLinkWord-'+this.objectNumber+'" class="tooltip" style="cursor:pointer;">' + '<span style="margin-right: 5px;" onclick='+this.stringFunction+'>' + this.string + '</span>' + '<span class="tooltiptext" style="width:200px;"> <span>'+this.string+'</span> <br> <span>'+this.beginning+'-'+this.end+'</span> <br> <span>Playback Rate:'+this.playbackRate+'</span> <hr> <button onclick="audioLinkArrayObjects['+this.objectNumber+'].decreasePlaybackRate()"> - Playback  </button> <button onclick="audioLinkArrayObjects['+this.objectNumber+'].increasePlaybackRate()"> + Playback  </button> <button onclick="audioLinkArrayObjects['+this.objectNumber+'].decreaseTime()"> - EndTime  </button> <button onclick="audioLinkArrayObjects['+this.objectNumber+'].increaseTime()"> + EndTime  </button> <button onclick="audioLinkArrayObjects['+this.objectNumber+'].decreaseTimeBeginning()"> - begTime  </button> <button onclick="audioLinkArrayObjects['+this.objectNumber+'].increaseTimeBeginning()"> + begTime  </button> </span> </span>';
      resetAudioLinkHtml();
    }
}

function resetAudioLinkHtml(){
  var innerHTMLText = '';
  for(var i = 0; i < audioLinkArrayObjects.length; i++){
    innerHTMLText += audioLinkArrayObjects[i].html;
  }
  document.querySelector('#audio-link-content').innerHTML = innerHTMLText;
  makeAllSynonymButtons();
}

function addToAudioLinkAndChangeHtml(beginning,end, playbackRate,string){
  var stringFunction = createStringForAudioLinkEval(beginning,end, playbackRate, audioLinkArrayObjects.length);
  var newAudioLinkObject = new audioLinkObject(beginning, end,playbackRate,stringFunction,string);
  console.log(newAudioLinkObject);
  audioLinkArrayObjects.push(newAudioLinkObject);
  resetAudioLinkHtml();
}


function linkAudioLinkArray(){
  var newAudioLinkArrayOnlyStringFunctions = [];
  for (var i = 0; i < audioLinkArrayObjects.length; i++) {
    newAudioLinkArrayOnlyStringFunctions.push(audioLinkArrayObjects[i].stringFunction);
  }
  // CREATE CLONE OF AUDIOLINKARRAY
  var audioLinkArray2 = JSON.parse(JSON.stringify(newAudioLinkArrayOnlyStringFunctions));
  console.log(audioLinkArray2);
  for (var i = 0; i < audioLinkArrayObjects.length; i++) {
    if (audioLinkArray2[i + 1]) {
      audioLinkArray2[i] = audioLinkArray2[i].replace('console.log("FINISHED")',audioLinkArray2[i+1]);
      audioLinkArray2.splice(i+1,1);
      i -= 1;
    }
  }
  return audioLinkArray2.join('');
}


function getRandomAudioLinkFromCurrentFound(){
  audioLinkArray = [];
  randomAudioLinkTimesArray = [];
  for (var i = 0; i < liHtmlArray.length; i++) {
    var randomNumber = Math.floor(Math.random() * liHtmlArray[i].length);
    var buttonArrayToRandomlySelect = document.querySelector('#playCustomChunk-'+i+'-'+randomNumber);
    var buttonAsString = document.getHTML(buttonArrayToRandomlySelect,true)
    randomAudioLinkTimesArray.push(buttonArrayToRandomlySelect);
    document.querySelectorAll('.stringFound')[i].innerHTML = buttonAsString;
    document.querySelectorAll('.stringFound > button')[i].style.color = 'green';
    var times = randomAudioLinkTimesArray[i].querySelector('.timeChunk').innerHTML.split('-');
    }
  return randomAudioLinkTimesArray;
}

function playAudioLinkString(){
  if (audioLinkArrayObjects.length > 0) {
    eval(linkAudioLinkArray());
  }
}

function emptyAudioLinkString(){
  audioLinkArray = [];
  audioLinkArrayObjects = [];
  document.querySelector('#audio-link-content').innerHTML = '';
}

// ------------------------------------------------------------------------------

function advancedObjectSplice(){
  var objectWordsInOrderArray = getAllWordObjectsInAlphabeticOrder();
  var overallArray = [];
  var arrayToPushObjectsInto = [];
  for (var i = 0; i < objectWordsInOrderArray.length; i++) {
    var word = objectWordsInOrderArray[i].word;
        arrayToPushObjectsInto.push(objectWordsInOrderArray[i]);
    if(word.indexOf('.') !== -1){
      overallArray.push(arrayToPushObjectsInto);
      arrayToPushObjectsInto = [];
    }
  }
  return overallArray;
}

function advancedObjectSpliceSTRING(){
  var objectWordsInOrderArray = getAllWordObjectsInAlphabeticOrder();
  var correctTranscriptArray = [];

  for (var i = 0; i < objectWordsInOrderArray.length; i++) {
    correctTranscriptArray.push(objectWordsInOrderArray[i].word.replace(/\s+/g, ""));
  }

  var stringWordsInOrderArray = correctTranscriptArray;
  var overallArray = [];
  var arrayToPushStringsInto = [];
  for (var i = 0; i < stringWordsInOrderArray.length; i++) {
    var word = stringWordsInOrderArray[i];
        arrayToPushStringsInto.push(stringWordsInOrderArray[i]);
    if(word.indexOf('.') !== -1){
      overallArray.push(arrayToPushStringsInto);
      arrayToPushStringsInto = [];
    }
  }

  return overallArray;
}

// ----------------------------------------------------------------

function getAllSubArraysForChunkedTranscript(array){
  var subArrays = [];
  for (var i = 0; i < array.length; i++) {
    subArrays.push(getAllSubArrays(array[i]));
  }
  return subArrays;
}

function getAllWordObjectsInAlphabeticOrder(){
  var arrayOfAllIndividualObjects = [];
  var transcriptTextHTML = '';
  rawTranscript = [];
  for (var i = 0; i < allWordsArray.length; i++) {
    for (var y = 0; y < allWordsArray[i].objects.length; y++) {
      arrayOfAllIndividualObjects.push(allWordsArray[i].objects[y]);
    }
  }
    arrayOfAllIndividualObjects.sort(function(a, b) {
      return a.startsAt - b.startsAt;
  })
  for (var i = 0; i < arrayOfAllIndividualObjects.length; i++) {
    arrayOfAllIndividualObjects[i].wordNumber = i;
    transcriptTextHTML += '<span id="span-word-'+arrayOfAllIndividualObjects[i].word.replace(/\s+/g, "")+'">'+arrayOfAllIndividualObjects[i].word+'</span>';
    rawTranscript.push(arrayOfAllIndividualObjects[i].word.replace(/\s+/g, ""));
  }
  var rawTranscript = rawTranscript.join(' ');
  rawTranscriptArray = rawTranscript.split(' ');
  return arrayOfAllIndividualObjects;
}


function searchInMultiSubArray(array,string){
  var resultsArray = [];
  for (var i = 0; i < array.length; i++) {
    for (var y = 0; y < array[i].length; y++) {

      // IF STARTS WITH OR ENDS WITH SPACE--------------
      if(string[0] === ' '){
        string = spliceSlice(string,0,1);
      }
      if(string[string.length-1] === ' '){
        string = spliceSlice(string,string.length-1,1);
      }
      // -----------------------------------------------
      var stringValue = string.toLowerCase().replace(/'/g, '').replace('.', '');
      var compareValue = array[i][y].join(' ').toLowerCase().replace(/'/g, '').replace('.', '')

      if (stringValue === compareValue) {
        resultsArray.push({iVal:i,yVal:y});
      }
    }
  }
  return resultsArray;
}

// ----------------------------------------------------------------

function searchInTranscriptChunkedInOrderAsStrings(string){
  var results = searchInMultiSubArray(transcriptChunkedInOrderAsStrings,string);
  if(results.length > 0){
    return results;
  }else{
    return false;
  }
}

// ----------------------------------------------------------------

function getTimesOfString(string){
  var times = searchInTranscriptChunkedInOrderAsStrings(string);
  var arrayOfTimesToReturn = [];
  if(times){
    for (var i = 0; i < times.length; i++) {
      var arrayOfWordObjects = transcriptChunkedInOrderAsObjects[times[i].iVal][times[i].yVal];
      var length = arrayOfWordObjects.length;
      var startsAt = arrayOfWordObjects[0].startsAt;
      var endsAt = arrayOfWordObjects[length-1].endAt;
      arrayOfTimesToReturn.push({
        startsAt: startsAt,
        endAt:endsAt
      });
    }
  }
  return arrayOfTimesToReturn;
}
// ----------------------------------------------------------------
var wordsSearched = [];
var stringsFoundArray = [];
function getTimesOfStringAdvanced(string, originalString){
  // SPLIT STRING INTO ARRAY
    var stringArray = string.split(' ');
  // GET ARRAY OF TIMES OF STRING PARAMETER
    var times = getTimesOfString(string);
  // IF TIMES ARRAY IS EMPTY AND STRINGARRAY IS EMPTY
    if (times.length === 0 && stringArray.length > 0 && stringArray[0] !== '') {
      console.log('stringArray');
      console.log(stringArray);
  // SPLICE THE LAST WORD IN STRINGARRAY
      stringArray.splice(stringArray.length-1,1);
  // JOIN THE RECENTLY SPLICED ARRAY INTO A STRING
      var string = stringArray.join(' ');
  // RECURSIVE... CHECK THE STRING AGAIN WITHOUT THE LAST WORD
      return getTimesOfStringAdvanced(string, originalString);
    }
  // IF THE STRING IS FOUND IN ANY ITERATION, THE FUNCTION IS RETURNED
    else{
      var objectToReturn = {
        originalString: originalString,
        stringFound: string,
        times: times
      }
      wordsSearched.push('<span style="display:inline-block;" class="tooltip"><span class="stringFound"><button style="cursor:pointer;color:green;">'+string+'</button></span> <span class="tooltiptext" id="tooltip-forWord-'+liHtmlArray.length+'"></span></span>')
      stringsFoundArray.push(string);
      if(string === ''){
        var originalStringArray = originalString.split(' ');
        originalStringArray.splice(0,1);
        var newString = originalStringArray.join(' ');
        return getTimesOfStringAdvanced(newString, newString);
      }
      return objectToReturn;
    }
}

// ----------------------------------------------------------------

function getTimesOfStringEvenMoreAdvanced(string){
  var stringArray = string.split(' ');
  if(!searchInTranscriptChunkedInOrderAsStrings(stringArray[0])){
    wordsSearched.push('<span style="display:inline-block;" class="tooltip" ><span class="stringNotFound"><button class="stringNotFoundButton-'+stringArray[0]+'" style="cursor:pointer;color:red;">'+stringArray[0]+'</button></span> <span class="tooltiptext" id="tooltip-forWord-'+stringArray[0].split(' ').join('-')+'"> <button onclick="shitNigga()">TOOLTIP</button></span></span>')
    if (stringArray.length <= 1) {
      return;
    }
    stringArray.splice(0,1);
    string = stringArray.join(' ');
    return getTimesOfStringEvenMoreAdvanced(string);
  }
  if(!searchInTranscriptChunkedInOrderAsStrings(stringArray[stringArray.length-1])){
    if (stringArray.length <= 1) {
      return;
    }
    stringArray.splice(stringArray.length-1,1);
    string = stringArray.join(' ');
    return getTimesOfStringEvenMoreAdvanced(string);
  }
  if (string[0] === ' ') {
    string = spliceSlice(string,0,1);
  }
  if (string[string.length-1] === ' ') {
    string = spliceSlice(string,string.length-1,1);
  }
  var initialTimesFound = getTimesOfStringAdvanced(string,string);
  return initialTimesFound;
}
// ----------------------------------------------------------------

var liHtmlArray = [];
var multipleTimesIncrementer = 0;

function getMultipleTimesOfString(string){

  if(string === ''){
    return;
  }
  if (multipleTimesIncrementer === 0) {
    arrayOfTimeObjects = [];
  }
  multipleTimesIncrementer++;
  var object = getTimesOfStringEvenMoreAdvanced(string);
  arrayOfTimeObjects.push(object);
  var originalString = object.originalString;
  var stringFound = object.stringFound;


  var times = object.times;

  var buttonHtml = '';
  var buttonHtml = [];


  for (var i = 0; i < times.length; i++) {
    var currentLiHtmlLength = liHtmlArray.length;
    buttonHtml.push('<span class="playChunkOuterSpan" id="playCustomChunkSpan-'+currentLiHtmlLength+'-'+i+'"><button class="playChunk" id="playCustomChunk-'+currentLiHtmlLength+'-'+i+'" onclick="playChunkOfAudio('+times[i].startsAt + ',' + times[i].endAt+')">'+stringFound+'[<span class="timeChunk">'+times[i].startsAt +'-'+times[i].endAt+'</span>]'+'</button><button class="reduceChunk" onclick="reduceChunkOfAudioBy1Milisecond('+currentLiHtmlLength+','+i+')"> - </button><button class="increaseChunk" onclick="increaseChunkOfAudioBy1Milisecond('+currentLiHtmlLength+','+i+')"> + </button><button class="deleteChunk" onclick="removeWithinCustomUlButtons('+currentLiHtmlLength+','+i+')"> X </button><button class="addToAudioLinkButton" onclick="addToAudioLinkAndChangeHtml('+times[i].startsAt + ',' + times[i].endAt+',1,'+'`'+stringFound+'`)'+'">ADD</button><button class="addToAudioLinkButton" onclick="increasePlaybackSpeed('+currentLiHtmlLength+','+i+')"> Speed Up </button></span>');
  }
  console.log(buttonHtml);
  liHtmlArray.push(buttonHtml);

  var newStringToSearch = originalString.replace(stringFound,'');
  if(newStringToSearch[0] === ' '){
    newStringToSearch = spliceSlice(newStringToSearch,0,1);
  }
  if(newStringToSearch.length >= 1){
    return getMultipleTimesOfString(newStringToSearch);
  }
  multipleTimesIncrementer = 0;
  return arrayOfTimeObjects;
}


// ----------------------------------------------------------------

function createCustomButtons(){
  var string = document.querySelector('#customWordButtonsTextarea').value;
  var stringSeparatedBySentences = string.split('.');
  var stringArray = string.split(' ');

  for (var i = 0; i < stringSeparatedBySentences.length; i++) {
    getMultipleTimesOfString(stringSeparatedBySentences[i]);
  }

  document.querySelector('#linked-content').innerHTML = wordsSearched.join(' ');
  document.querySelector('#customWordButtonsTextarea').value = '';
  var innerUlHtml = '';
  for (var i = 0; i < liHtmlArray.length; i++) {
    innerUlHtml += '<li>'
    for (var y = 0; y < liHtmlArray[i].length; y++) {
      innerUlHtml += liHtmlArray[i][y];
    }
    innerUlHtml += '</li>'
  }
for(var i = 0; i < document.querySelectorAll('.stringFound').length; i++){
  document.querySelectorAll('.stringFound')[i].nextSibling.nextSibling.innerHTML = liHtmlArray[i].join('<br>')
}
}



function removeWithinCustomUlButtons(i,y){
  if(liHtmlArray[i][y+1]){
    for (var z = y+1; z < liHtmlArray[i].length; z++) {
      liHtmlArray[i][z] = liHtmlArray[i][z].replace('playCustomChunk-'+i+'-'+z+'','playCustomChunk-'+i+'-'+(z-1));
      liHtmlArray[i][z] = liHtmlArray[i][z].replace('playCustomChunkSpan-'+i+'-'+z+'','playCustomChunkSpan-'+i+'-'+(z-1));
      liHtmlArray[i][z] = liHtmlArray[i][z].replace('removeWithinCustomUlButtons('+i+','+z+')', 'removeWithinCustomUlButtons('+i+','+(z-1)+')');
      liHtmlArray[i][z] = liHtmlArray[i][z].replace('reduceChunkOfAudioBy1Milisecond('+i+','+z+')', 'reduceChunkOfAudioBy1Milisecond('+i+','+(z-1)+')');
      liHtmlArray[i][z] = liHtmlArray[i][z].replace('increaseChunkOfAudioBy1Milisecond('+i+','+z+')', 'increaseChunkOfAudioBy1Milisecond('+i+','+(z-1)+')');
      liHtmlArray[i][z] = liHtmlArray[i][z].replace('increasePlaybackSpeed('+i+','+z+')', 'increasePlaybackSpeed('+i+','+(z-1)+')');
    }
  }
  liHtmlArray[i].splice(y,1);
  if(liHtmlArray[i].length === 0){
    liHtmlArray.splice(i,1);
  }
  createCustomButtons();
}

function reduceChunkOfAudioBy1Milisecond(i,y){
  var string = document.querySelector('#playCustomChunkSpan-'+i+'-'+y+' > #playCustomChunk-'+i+'-'+y).innerHTML.replace(/\[(.+?)\]/g, "");
  var times = document.querySelector('#playCustomChunkSpan-'+i+'-'+y+' > #playCustomChunk-'+i+'-'+y+' .timeChunk').innerHTML.split('-');

  times[0] = Number(times[0]);
  times[1] = Number(times[1]);

  times[1] -= 0.01;

  document.querySelector('#playCustomChunkSpan-'+i+'-'+y+' > #playCustomChunk-'+i+'-'+y+' .timeChunk').innerHTML = times[0].toFixed(2) + '-' + times[1].toFixed(2);
  document.querySelector('#playCustomChunkSpan-'+i+'-'+y+' > #playCustomChunk-'+i+'-'+y).onclick = function(){playChunkOfAudio(times[0],times[1])}
  document.querySelector('#playCustomChunkSpan-'+i+'-'+y+' > .addToAudioLinkButton').onclick = function(){ addToAudioLinkAndChangeHtml(times[0],times[1],1,string); }
}

function increaseChunkOfAudioBy1Milisecond(i,y){
  var string = document.querySelector('#playCustomChunkSpan-'+i+'-'+y+' > #playCustomChunk-'+i+'-'+y).innerHTML.replace(/\[(.+?)\]/g, "");
  var times = document.querySelector('#playCustomChunkSpan-'+i+'-'+y+' > #playCustomChunk-'+i+'-'+y+' .timeChunk').innerHTML.split('-');

  times[0] = Number(times[0]);
  times[1] = Number(times[1]);

  times[1] += 0.01;

  document.querySelector('#playCustomChunkSpan-'+i+'-'+y+' > #playCustomChunk-'+i+'-'+y+' .timeChunk').innerHTML = times[0].toFixed(2) + '-' + times[1].toFixed(2);
  document.querySelector('#playCustomChunkSpan-'+i+'-'+y+' > #playCustomChunk-'+i+'-'+y).onclick = function(){playChunkOfAudio(times[0],times[1])}
  document.querySelector('#playCustomChunkSpan-'+i+'-'+y+' > .addToAudioLinkButton').onclick = function(){ addToAudioLinkAndChangeHtml(times[0],times[1],1,string); }
}

document.querySelector('#customWordButtonsTextarea').value = '';



function playString(string){
  var times = getTimesOfStringEvenMoreAdvanced(string).times;
  console.log(times)

  if(times.length > 0){
    var randomNumber = Math.floor(Math.random() * times.length);
    console.log(randomNumber)
    if(times[randomNumber] && times[randomNumber].startsAt && times[randomNumber].endAt){
        playChunkOfAudio(times[randomNumber].startsAt,times[randomNumber].endAt);
    }else{
      console.log(times[randomNumber])
    }
  }else{
    console.log(string+' not found');
  }
}

function playStringTextInput(){
  playString(document.querySelector('#playStringTextInput').value);
  document.querySelector('#playStringTextInput').value = '';
}


// -------------------------------------------------------------------

function getArrayOfTimeStamps(fullTranscript, endOfAudio){
  // Replace all line breaks with '!!!!' so that you can easily split into an array.
  var arrayOfLines = fullTranscript.replace( /\n/g, "!!!!" ).split( "!!!!" );
  // arrayOfTimeStamps will be an array of objects
  var arrayOfTimeStamps = [];

  for(var i = 0; i <=  arrayOfLines.length - 1; i++){
  // If a line has 8 ('00:00:00') or 17 ('00:00:00PlayPause') characters,
    // it indicates that the line is a timestamp line
    if(arrayOfLines[i].length === 8 || arrayOfLines[i].length === 17){
      // Push those lines and the next paragraph into arrayOfTimeStamps
      arrayOfTimeStamps.push({
        timestamp: arrayOfLines[i].replace('PlayPause',''),
        paragraph: arrayOfLines[i+1]
      })
    }
  }

  // Get the convertedTime of paragraphs, because they need to be comparable to the individual words.
  for(var i = 0; i <=  arrayOfTimeStamps.length - 1; i++){
  let convertedTime = 0;
    convertedTime += Number(arrayOfTimeStamps[i].timestamp[7])/1;
    convertedTime += Number(arrayOfTimeStamps[i].timestamp[6])*10;
    convertedTime += Number(arrayOfTimeStamps[i].timestamp[4])*60;
    convertedTime += Number(arrayOfTimeStamps[i].timestamp[3])*1000;
    convertedTime += Number(arrayOfTimeStamps[i].timestamp[1])*10000;
    convertedTime += Number(arrayOfTimeStamps[i].timestamp[0])*100000;
    arrayOfTimeStamps[i].startsAt = convertedTime;
  }

  // Get when the paragraph ends.
  for(var i = 0; i <=  arrayOfTimeStamps.length - 1; i++){
    if(arrayOfTimeStamps[i+1]){
      arrayOfTimeStamps[i].endsAt = arrayOfTimeStamps[i+1].startsAt;
    }else{
      // For the last paragraph, the endsAt value will be the end of the audio
      arrayOfTimeStamps[i].endsAt = endOfAudio;
    }
  }
  return arrayOfTimeStamps;
}


// The raw transcript without any extra stuff
var rawTranscript;

var transcriptChunkedInOrderAsObjects;
var transcriptChunkedInOrderAsStrings;

var currentTranscript;
var titleOfTranscript;
var allWordsArrayTotal = [];

var allTranscriptObjects = [];



function createNewSoundBoard(){
  if(currentAudioFileBeingPlayed
    && document.getElementById('text').value[0] === '['
    && document.getElementById('text').value[1] === '{'){
    eval('allWordsArray = ' + document.getElementById('text').value + ';allWordsArrayTotal.push('+document.getElementById('text').value+')');
    console.log(allWordsArray);

    for (var i = 0; i < allWordsArray.length; i++) {
      allWordsArray[i].transcript = allWordsArray[allWordsArray.length-1],1;
      allWordsArray[i].title = allWordsArray[allWordsArray.length-2],1;
    }

    endOfAudio = allWordsArray[allWordsArray.length-1];
    allWordsArray.splice(allWordsArray.length-1,1);

    currentTranscript = allWordsArray[allWordsArray.length-1];
    allWordsArray.splice(allWordsArray.length-1,1);

    titleOfTranscript = allWordsArray[allWordsArray.length-1];
    allWordsArray.splice(allWordsArray.length-1,1);


    // replace all spaces ' ' and hyphens '-' with '' so that it avoids any confusion.
    if(currentAudioFileBeingPlayed[0].name.replace(/\s+/g, "").replace(/-/g, '').replace(/'/g, '') !== titleOfTranscript.replace(/\s+/g, "-").replace(/-/g, '').replace(/'/g, '')){
      console.log(currentAudioFileBeingPlayed[0].name.replace(/\s+/g, "").replace(/-/g, '').replace(/'/g, ''));
      console.log(titleOfTranscript.replace(/\s+/g, "-").replace(/-/g, '').replace(/'/g, ''));
      alert('Audio File Title Does Not Match');
      return;
    }

    document.getElementById('text').value = '';
    document.querySelector('#enterTranscriptDiv').style.display = 'none';
    document.querySelector('#app-content').style.display = 'block';
    document.querySelector('audio').pause();

    rawTranscript = currentTranscript.replace(/\(.*?\)/g, '');

    var arrayOfLines = rawTranscript.replace( /\n/g, "!!!!" ).split( "!!!!" );

    for(var i = arrayOfLines.length - 1; i >=  0; i--){
    // If a line has 8 ('00:00:00') or 17 ('00:00:00PlayPause') characters,
      // it indicates that the line is a timestamp line
      if(arrayOfLines[i].length === 8 || arrayOfLines[i].length === 17 || arrayOfLines[i] === ''|| arrayOfLines[i] === ' '){
        // Push those lines and the next paragraph into arrayOfTimeStamps
        arrayOfLines.splice(i,1)
      }
    }


    rawTranscript = arrayOfLines.toString().replace(`×,Easily edit this transcript,Sonix has created the world's first AudioText Editor™—it stitches the audio to text and works like a word processor in your browser. Click on a word below and start typing. Hit enter to break apart who said what.,`,'').replace(/,/g, " ");
    rawTranscriptArray = rawTranscript.split(' ');

    transcriptChunkedInOrderAsStrings = getAllSubArraysForChunkedTranscript(advancedObjectSpliceSTRING());
    transcriptChunkedInOrderAsObjects = getAllSubArraysForChunkedTranscript(advancedObjectSplice());

    allTranscriptObjects.push({
      transcriptChunkedInOrderAsStrings: transcriptChunkedInOrderAsStrings,
      transcriptChunkedInOrderAsObjects: transcriptChunkedInOrderAsObjects,
      audioFile: currentAudioFileBeingPlayed
    });
  }else if(
    !(document.getElementById('text').value[0] === '['
  && document.getElementById('text').value[1] === '{')){
    alert('Make sure text has the correct format!');
  }else{
    alert('Upload an audio file first!');
  }
}
